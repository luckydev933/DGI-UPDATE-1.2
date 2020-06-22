const Controller = require('express').Router()
const DBO = require('../../../modules/database')
const Model = require('../../models/H23/INV2Model')
const SQL = require('mssql')
const sha256 = require('js-sha256')

function InputDateFormat(DateString){
    const Format = DateString.split("/")
    const Day    = Format[0]
    const Month  = Format[1]
    const Year   = Format[2]

    return Year+"/"+Month+"/"+Day
}

function InputDateFormat2(DateString){
    const Format = DateString.split("/")
    const Sub = Format[2]
    const SUB = Sub.split(" ")
    const Day    = Format[0]
    const Month  = Format[1]
    const Year   = SUB[0] 

    return Year+"/"+Month+"/"+Day+" "+SUB[1]
    //return SUB[1]
}


Controller.post('/', async function(request, response){
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
                        for(var a = 0; a < request.body.njb.length; a++){
                            for(var c =0; c < request.body.nsc.length; c++){
                            const Insert = await pool.request()
                            .input('NO_WO_INVOICE', SQL.VarChar(25), request.body.noWorkOrder)
                            .input('NO_NJB_WO', SQL.VarChar(25), request.body.noNJB)
                            .input('TGL_NJB_WO', SQL.DateTime, InputDateFormat(request.body.tanggalNJB))
                            .input('TOTAL_PERNJB', SQL.Int, request.body.totalHargaNJB)
                            .input('NO_NSC_WO', SQL.VarChar(25), request.body.noNSC)
                            .input('TGL_NSC_WO', SQL.Date, InputDateFormat(request.body.tanggalNSC))
                            .input('TOTAL_PERNSC', SQL.Int, request.body.totalHargaNSC)
                            .input('KD_SA', SQL.VarChar(10), request.body.hondaIdSA)
                            .input('KD_MEKANIK', SQL.VarChar(10), request.body.hondaIdMekanik)
                            .input('KD_JOB_NJB', SQL.VarChar(10), request.body.njb[a].idJob)
                            .input('HARGA_SERVICE', SQL.Int, request.body.njb[a].hargaServis)
                            .input('KD_PROMO_JASA', SQL.VarChar(10), request.body.njb[a].promoIdJasa)
                            .input('NILAI_JASA_AMOUNT', SQL.Int, request.body.njb[a].discServiceAmount)
                            .input('NILAI_JASA_PERSEN', SQL.Float, request.body.njb[a].discServicePercentage)
                            .input('TOTAL_HARGA_SERVICE', SQL.Int, request.body.njb[a].totalHargaServis)
                            .input('CREATED_TIME_NJB', SQL.DateTime, InputDateFormat2(request.body.njb[a].createdTime))
                            .input('KD_JOB_NSC', SQL.VarChar(10), request.body.nsc[c].idJob)
                            .input('PART_NUMBER', SQL.VarChar(25), request.body.nsc[c].partsNumber)
                            .input('QTY', SQL.Int, request.body.nsc[c].kuantitas)
                            .input('HARGA_PART', SQL.Int(25), request.body.nsc[c].hargaParts)
                            .input('KD_PROMO_PART', SQL.VarChar(10), request.body.nsc[c].promoIdParts)
                            .input('NILAI_PART_AMOUNT', SQL.Int, request.body.nsc[c].discPartsAmount)
                            .input('NILAI_PART_PERSEN', SQL.Float, request.body.nsc[c].discPartsPercentage)
                            .input('PPN', SQL.Int, request.body.nsc[c].ppn)
                            .input('TOTAL_HARGA_PART', SQL.Int, request.body.nsc[c].totalHargaParts)
                            .input('UANG_MUKA', SQL.Int, request.body.nsc[c].uangMuka)
                            .input('CREATED_TIME_NSC', SQL.DateTime, InputDateFormat2(request.body.nsc[c].createdTime))
                            .execute(Model.INV2())
                            } 
                        }
                    response.status(200).json({
                        status: 1,
                        data: null,
                        message: {
                            confirmation: 'Data Berhasil Disimpan'
                        }
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