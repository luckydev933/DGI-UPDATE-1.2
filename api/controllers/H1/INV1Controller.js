const Controller = require('express').Router()
const DBO = require('../../../modules/database')
const Model = require('../../models/H1/INV1Model')
const SQL = require('mssql')
const sha256 = require('js-sha256')

Controller.post('/', async function(request, response) {
    const api_key    = request.header('DGI-API-Key')
    const unix       = request.header('X-Request-Time')
    const api_token  = request.header('DGI-API-Token')

    const validationUnix = Math.floor(new Date() / 1000) - unix
    if (validationUnix <= 10) {
        try {

            const hash = sha256.create()
            const databinding = []
            const pool = await SQL.connect(DBO.Connection)

            const secret_key = await pool.request()
                .input('API_KEY', SQL.VarChar(250), api_key)
                .execute('SP_DGI_API_AUTH_VALIDATION')
            console.log(secret_key.recordset)
            console.log(api_key)
            hash.update(api_key + '' + secret_key.recordset[0].SECRET_KEY + '' + unix)
            console.log(api_key + ' ' + api_token)
            const hex = hash.hex()
            if (hex == api_token) {
                try {
                    const dealerId = await pool.request()
                        .input('API_KEY', SQL.VarChar(250), api_key)
                        .input('SECRET_KEY', SQL.VarChar(250), secret_key.recordset[0].SECRET_KEY)
                        .execute('SP_DGI_API_AUTH')
                    const Insert = await pool.request()
                        .input('NO_INVOICE', SQL.VarChar(17), request.body.idInvoice)
                        .input('NO_SPK', SQL.VarChar(17), request.body.idSPK)
                        .input('KD_DEALERAHM', SQL.VarChar, dealerId.recordset[0].DEALER_ID)
                        .input('KD_CUSTOMER', SQL.VarChar(18), request.body.idCustomer)
                        .input('HARGA_UNIT', SQL.Decimal, request.body.amount)
                        .input('TIPE_JUAL', SQL.VarChar(15), request.body.tipePembayaran)
                        .input('CARA_BAYAR', SQL.VarChar(15), request.body.caraBayar)
                        .input('STATUS_SPK', SQL.VarChar(15), request.body.status)
                        .input('KETERANGAN', SQL.VarChar(250), request.body.note)
                        .execute(Model.Insert())
                    response.status(200).json({
                        status: 1,
                        message: {
                            confirmation: "Data berhasil disimpan"
                        },
                        data: null
                    })
                } catch (error) {
                    response.status(400).json({
                        status: 0,
                        message: {
                            confirmation: "Gagal Menyimpan Data " + error
                        },
                        data: null
                    })
                }
            } else {
                response.status(400).json({
                    status: 0,
                    message: {
                        confirmation: 'Token Invalid'
                    }
                })
            }

        } catch (error) {
            console.log(error)
            response.status(400).json({
                status: 0,
                message: {
                    confirmation: 'Secret Key is Wrong !!'
                }
            })
        }
    } else {
        response.status(200).json({
            status: 0,
            message: {
                confirmation: 'Unix Timestamp Invalid'
            }
        })
    }

})

module.exports = Controller