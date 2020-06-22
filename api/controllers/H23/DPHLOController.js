const Controller = require('express').Router()
const DBO = require('../../../modules/database')
const Model = require('../../models/H23/DPHLOModel')
const SQL = require('mssql')
const sha256 = require('js-sha256')

function InputDateFormat(DateString){
    const Format = DateString.split("/")
    const Day    = Format[0]
    const Month  = Format[1]
    const Year   = Format[2]

    return Year+"/"+Month+"/"+Day
}

Controller.post('/', async function(request, response){

    console.log(InputDateFormat(request.body.tanggalPemesananHLO))

    const api_key    = request.header('DGI-API-Key')
    const unix       = request.header('X-Request-Time')
    const api_token  = request.header('DGI-API-Token')

    const validationUnix = Math.floor(new Date() / 1000) - unix
    if(validationUnix <= 10){
        try{

            const hash = sha256.create()
            const databinding = []
            const pool = await SQL.connect(DBO.Connection)

            const secret_key = await pool.request()
            .input('API_KEY', SQL.VarChar(250), api_key)
            .execute('SP_DGI_API_AUTH_VALIDATION')
            console.log(secret_key.recordset)
            console.log(api_key)
            hash.update(api_key+''+secret_key.recordset[0].SECRET_KEY+''+unix)
            console.log(api_key+' '+api_token)
            const hex = hash.hex()
            if(hex == api_token){
                try {
                    const dealerId = await pool.request()
                    .input('API_KEY', SQL.VarChar(250), api_key)
                    .input('SECRET_KEY', SQL.VarChar(250), secret_key.recordset[0].SECRET_KEY)
                    .execute('SP_DGI_API_AUTH')
                    for(i = 0; i < request.body.parts.length; i++){
                        const Insert = await pool.request()
                        .input('NO_KWITANSI', SQL.VarChar(25), request.body.noInvoiceUangJaminan)
                        .input('KD_HLO', SQL.VarChar(25), request.body.idHLODocument)
                        .input('TGL_HLO', SQL.Date, InputDateFormat(request.body.tanggalPemesananHLO))
                        .input('NO_WO', SQL.VarChar(25), request.body.noWorkOrder)
                        .input('KD_CUSTOMER', SQL.VarChar(25), request.body.idCustomer)
                        .input('PART_NUMBER', SQL.VarChar(25), request.body.parts[i].partsNumber)
                        .input('QTY', SQL.Int, request.body.parts[i].kuantitas)
                        .input('HARGA', SQL.Int, request.body.parts[i].hargaParts)
                        .input('TOTAL_HARGA', SQL.Int, request.body.parts[i].totalHargaParts)
                        .input('UANG_MUKA', SQL.Int, request.body.parts[i].uangMuka)
                        .input('SISA_PEMBAYARAN', SQL.Int, request.body.parts[i].sisaBayar)
                        .input('KD_DEALER', SQL.VarChar(5), request.body.parts[i].dealerId)
                        // .input('CREATED_TIME', SQL.DateTime, request.body.parts[i].createdTime)
                        .execute(Model.DPHLO())
                    }
                    response.status(200).json({
                        status: 1,
                        message: {
                            confirmation: 'Data Berhasil Disimpan'
                        },
                        data: null
                    })
                } catch (error) {
                    response.status(400).json({
                        status: 0,
                        message: 'Gagal Mengambil Data !! Error Info : '+error,
                        data: null
                    })
                }
            }else{
                response.status(400).json({
                    status: 0,
                    message: {
                        confirmation: 'Token Invalid'
                    }
                })
            }

        }catch(error){
            console.log(error)
            response.status(400).json({
                status: 0,
                message: {
                    confirmation: 'Secret Key is Wrong !!'
                }
            })
        }
    }else{
        response.status(200).json({
            status: 0,
            message: {
                confirmation: 'Unix Timestamp Invalid'
            }
        })
    }

})


module.exports = Controller