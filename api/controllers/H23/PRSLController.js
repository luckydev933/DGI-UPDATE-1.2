const Controller = require('express').Router()
const DBO = require('../../../modules/database')
const Model = require('../../models/H23/PRSLModel')
const SQL = require('mssql')
const sha256 = require('js-sha256')
const RequestControl = require('../../../modules/Authorization')

function DateSplitter(datestring){
    const DateSplit = datestring.split(" ")
    const dateString = DateSplit[0].split("-")
    return dateString[1]+"/"+dateString[2]+"/"+dateString[0]
}

function DateCounter(dateString1, dateString2){
    d1 = new Date(DateSplitter(dateString1));
    d2 = new Date(DateSplitter(dateString2));
    d3 = (d2.getTime() - d1.getTime()) / (1000*3600*24)
    return d3;
}

function FromTime(fromtime){
    const split = fromtime.split("")
    const year = split[0]+""+split[1]+""+split[2]+""+split[3];
    const month = split[4]+""+split[5];
    const day = split[6]+""+split[7];
    return day+"/"+month+"/"+year;
}

function SelisihTanggal(date){
var MyDate = new Date(date);
var MyDateString;

MyDate.setDate(MyDate.getDate() + 7);

MyDateString = ('0' + MyDate.getDate()).slice(-2) + '/'
             + ('0' + (MyDate.getMonth()+1)).slice(-2) + '/'
             + MyDate.getFullYear();
return MyDateString
}

Controller.post('/', async function(request, response){
    
    // Variable Request
    const api_key    = request.header('DGI-API-Key')
    const unix       = request.header('X-Request-Time')
    const api_token  = request.header('DGI-API-Token')
    // Validation
    const validationUnix = Math.floor(new Date() / 1000) - unix
    const TimeValidation = DateCounter(request.body.fromTime, request.body.toTime)
    console.log(TimeValidation)
    if(TimeValidation <= 30){
        if(validationUnix <= 10){
            const hash = sha256.create()
                const databinding = []
                const pool = await SQL.connect(DBO.Connection)
                const secret_key = await pool.request()
                .input('API_KEY', SQL.VarChar(250), api_key)
                .execute('SP_DGI_API_AUTH_VALIDATION')
                
                const baseIP = request.connection.remoteAddress
                const split = baseIP.split("ffff")
                const LogActivity = {
                    DealerRequestActivity: secret_key.recordset[0].DEALER_ID,
                    Endpoint: request.headers.host+""+request.originalUrl,
                    RequestTime: new Date().toUTCString(),
                    IPAddress: split[1],
                    PostData: request.body,
                    HttpResponseCode: response.statusCode,
                    ResponseData: response.data,
                     
                }
                hash.update(api_key+''+secret_key.recordset[0].SECRET_KEY+''+unix)
                
                console.log(request.headers)
                
                console.log('Request Time : '+new Date().getSeconds()+" Seconds")
                const Req = new Date().getMilliseconds() / 1000

                const hex = hash.hex()

                if(hex == api_token){
                    const dealerId = await pool.request()
                    .input('API_KEY', SQL.VarChar(250), api_key)
                    .input('SECRET_KEY', SQL.VarChar(250), secret_key.recordset[0].SECRET_KEY)
                    .execute('SP_DGI_API_AUTH')
                    const result = await pool.request().
                    input('dealerId', SQL.VarChar, dealerId.recordset[0].DEALER_ID).
                    input('group', SQL.VarChar, dealerId.recordset[0].DEALER_GROUP).
                    input('fromTime', SQL.VarChar, request.body.fromTime).
                    input('toTime', SQL.VarChar, request.body.toTime).
                    input('noSO', SQL.VarChar(25), request.body.noSO).
                    execute(Model.getPRSL())
                    if(result.recordset.length >0){
                        for(var i = 0; i < result.recordset.length; i++){
                                const bind = {
                                    noSO: result.recordset[i].NO_SO, 
                                    tglSO: result.recordset[i].TANGGAL_SO,
                                    idCustomer: result.recordset[i].KD_CUSTOMER,
                                    discSO: result.recordset[i].SO_DISKON,
                                    totalHargaSO: result.recordset[i].TOTAL_PERSO,
                                    parts: [
                                        {
                                        partsNumber: result.recordset[i].PART_NUMBER,
                                        kuantitas: result.recordset[i].QTY,
                                        hargaParts: result.recordset[i].HARGA_JUAL,
                                        promoIdParts: result.recordset[i].KD_PROMO,
                                        discAmount: result.recordset[i].DISKON_AMOUNT,
                                        discPercentage: result.recordset[i].SIKON_AVG,
                                        ppn: result.recordset[i].PPN,
                                        totalHargaParts: result.recordset[i].TOTAL_HARGA,
                                        uangMuka: result.recordset[i].UANG_MUKA,
                                        bookingIdReference: result.recordset[i].ID_HLO,
                                        createdTime: result.recordset[i].CREATED_TIME,
                                        }
                                    ]
                                }
                                databinding.push(bind)
 
                        }
                        var selisih = SelisihTanggal(databinding[0].tglSO)
                        response.set({
                            'X-Response-Message': 'null',
                            'X-Response-Dealer': secret_key.recordset[0].DEALER_ID,
                            'X-Response-Count': databinding.filter(function(index){
                                return new Date(index.tglSO).getTime() <= new Date(Date(selisih)).getTime()
                            }).length
                        })
                        response.status(200).json({
                            status: 1,
                            message: null,
                            data: databinding.filter(function(index){
                                return new Date(index.tglSO).getTime() <= new Date(Date(selisih)).getTime()
                            })
                        })
                        console.log('Response Time : '+((new Date().getMilliseconds()/ 1000) - Req)+" Seconds")
                        // for(a = 0; a < request.body.length;)
                    }else{
                        response.json({
                            status: 0,
                            message: 'Tidak Ada Data Pada Periode ini',
                            data: null
                        })
                    }

                }else{
                    response.json({
                        status: 0,
                        message: 'Token Tidak Valid !!',
                        data: null
                    })
                }
        }else{
            response.json({
                status: 0,
                message: 'Unix Timestamp Diluar Validasi Detik',
                data: null
            })
        }
    }else{
        response.json({
            status: 0,
            message: 'Melebihi Rentang Waktu Pengambilan Data , Max. 30 hari',
            data: null
        })
    }
})



module.exports = Controller