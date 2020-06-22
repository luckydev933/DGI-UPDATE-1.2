const Controller = require('express').Router()
const DBO = require('../../../modules/database')
const Model = require('../../models/H1/BASTModel')
const Auth = require('../../../modules/Authorization')
const SQL = require('mssql')
const sha256 = require('js-sha256')
const DateFormatting = require('../../../modules/DateFormatting')

function DateSplitter(datestring){
    const DateSplit = datestring.split(" ")
    const dateString = DateSplit[0].split("-")
    return dateString[1]+"/"+dateString[2]+"/"+dateString[0]
}

function DateCounter(dateString1, dateString2) {
    d1 = new Date(DateSplitter(dateString1));
    d2 = new Date(DateSplitter(dateString2));
    d3 = (d2.getTime() - d1.getTime()) / (1000 * 3600 * 24)
    return d3;
}


function DateParser(date){
    const DateString = date.split(",")
    const SPDate     = DateString[0].split("-")
    const SPString   = SPDate[0]+''+SPDate[1]+''+SPDate[2]
    return SPString
}

function SelisihTanggal(date) {
    var MyDate = new Date(date);
    var MyDateString;

    MyDate.setDate(MyDate.getDate() + 7);

    MyDateString = ('0' + MyDate.getDate()).slice(-2) + '/' +
        ('0' + (MyDate.getMonth() + 1)).slice(-2) + '/' +
        MyDate.getFullYear();
    return MyDateString
}

function TanggalBAST(date){
    var MyDate = new Date(date);
var MyDateString;

MyDateString = ('0' + MyDate.getDate()).slice(-2) + '/'
             + ('0' + (MyDate.getMonth()+1)).slice(-2) + '/'
             + MyDate.getFullYear();
return MyDateString
}

Controller.post('/', async function(request, response) {
    // Variable Request
    const api_key    = request.header('DGI-API-Key')
    const unix       = request.header('X-Request-Time')
    const api_token  = request.header('DGI-API-Token')
    // Validation
    const validationUnix = Math.floor(new Date() / 1000) - unix
    const TimeValidation = DateCounter(request.body.fromTime, request.body.toTime)
    console.log(TimeValidation)
    console.log(validationUnix)
    if (TimeValidation <= 30) {
        if (validationUnix <= 10) {
            const hash = sha256.create()
            const databinding = []
            const pool = await SQL.connect(DBO.Connection)
            const secret_key = await pool.request()
                .input('API_KEY', SQL.VarChar(250), api_key)
                .execute('SP_DGI_API_AUTH_VALIDATION')
            console.log(secret_key.recordset)
            console.log(api_key)
            hash.update(api_key+''+secret_key.recordset[0].SECRET_KEY+''+unix)

            const hex = hash.hex()
            console.log(hex)
            console.log(api_token)
            if (hex == api_token) {
                const dealerId = await pool.request()
                    .input('API_KEY', SQL.VarChar(250), api_key)
                    .input('SECRET_KEY', SQL.VarChar(250), secret_key.recordset[0].SECRET_KEY)
                    .execute('SP_DGI_API_AUTH')
                const BastResult = await pool.request()
                    .input('dealerId', SQL.VarChar, dealerId.recordset[0].DEALER_ID)
                    .input('fromTime', SQL.VarChar, request.body.fromTime)
                    .input('toTime', SQL.VarChar, request.body.toTime)
                    .input('deliveryDocumentId', SQL.VarChar, request.body.deliveryDocumentId)
                    .input('idSPK', SQL.VarChar, request.body.idSPK)
                    .input('idCustomer', SQL.VarChar, request.body.idCustomer)
                    .execute(Model.BAST())
                if (BastResult.recordset.length > 0) {
                    for (var i = 0; i < BastResult.recordset.length; i++) {
                        const bind = {
                            deliveryDocumentId: BastResult.recordset[i].NO_SURATJALAN,
                            tanggalPengiriman: DateFormatting.FormatDate(BastResult.recordset[i].TGL_KIRIM),
                            tanggalSuratjalan: DateFormatting.FormatDate(BastResult.recordset[i].TGL_SURATJALAN),
                            idDriver: BastResult.recordset[i].ID_DELIVERY,
                            statusDeliveryDocument: "4",
                            dealerId: BastResult.recordset[i].KD_DEALERAHM,
                            //statusDeliveryDocument: BastResult.recordset[i].STATUS_SJ,
                            detail: [{
                                noSO: BastResult.recordset[i].NO_SO,
                                idSPK: BastResult.recordset[i].NO_SPK,
                                noMesin: BastResult.recordset[i].NO_MESIN,
                                noRangka: BastResult.recordset[i].NO_RANGKA,
                                idCustomer: BastResult.recordset[i].KD_CUSTOMER,
                                waktuPengiriman: DateFormatting.FormatTime(BastResult.recordset[i].WAKTU_ESTIMASIKIRIM),
                                checklistKelengkapan: BastResult.recordset[i].NAMA_ITEM,
                                lokasiPengiriman: BastResult.recordset[i].ALAMAT_KIRIM,
                                latitude: BastResult.recordset[i].LATITUDE,
                                longitude: BastResult.recordset[i].LONGITUDE,
                                namaPenerima: BastResult.recordset[i].NAMA_PENERIMA,
                                noKontakPenerima: BastResult.recordset[i].NO_HP,
                                createdTime: BastResult.recordset[i].CREATED_TIME,
                                modifiedTime: BastResult.recordset[i].MODIFIED_TIME
                            }]
                        }
                        databinding.push(bind)
                    }
                    var selisih = SelisihTanggal(databinding[0].tanggalSuratjalan).toString()
                    const filter = []
                    const tanggal = new Date(databinding[0].tanggalSuratjalan).toLocaleString()
                    const pisah = tanggal.split(",")
                    const TanggalSJ1 = TanggalBAST(pisah[0])

                    console.log(new Date(databinding[0].tanggalSuratjalan).toLocaleString())
                    //console.log(TanggalSJ1)
                    const dataFilter = databinding.filter(function(index){
                        const tanggal = new Date(index.tanggalSuratjalan).toLocaleString()
                        const pisah = tanggal.split(",")
                        const TanggalSJ = TanggalBAST(pisah[0])
                        return new Date(TanggalSJ).getTime() <= new Date(selisih).getTime()
                     })
                    response.set({
                        'X-Response-Message': 'null',
                        'X-Response-Dealer': secret_key.recordset[0].DEALER_ID,
                        'X-Response-Count': dataFilter.length
                    })
                    
                    response.status(200).json({
                        status: 1,
                        message: null,
                        data: databinding.filter(function(index){
                            // const tanggal = new Date(index.tanggalSuratjalan).toLocaleString()
                            // const pisah = tanggal.split(",")
                            // const tanggalSJ = TanggalBAST(pisah[0])
                            // const stringDate = tanggalSJ;
                            return new Date(index.tanggalSuratjalan).getTime() <= new Date(Date(selisih)).getTime()
                        })
                    })
                } else {
                    response.json({
                        status: 0,
                        message: 'Tidak Ada Data Pada Periode ini',
                        data: null
                    })
                }

            } else {
                response.json({
                    status: 0,
                    message: 'Token Tidak Valid !!',
                    data: null
                })
            }
        } else {
            response.json({
                status: 0,
                message: 'Unix Timestamp Diluar Validasi Detik',
                data: null
            })
        }
    } else {
        response.json({
            status: 0,
            message: 'Melebihi Rentang Waktu Pengambilan Data , Max. 30 hari',
            data: null
        })
    }
})

module.exports = Controller