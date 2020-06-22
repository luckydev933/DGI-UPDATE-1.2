const Controller = require('express').Router()
const DBO = require('../../../modules/database')
const Model = require('../../models/H1/LSNGModel')
const Auth = require('../../../modules/Authorization')
const sha256 = require('js-sha256')
const SQL = require('mssql')

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

function FromTime(fromtime) {
    const split = fromtime.split("")
    const year = split[0] + "" + split[1] + "" + split[2] + "" + split[3];
    const month = split[4] + "" + split[5];
    const day = split[6] + "" + split[7];
    return day + "/" + month + "/" + year;
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

Controller.post('/', async function(request, response) {
    // Variable Request
    const api_key    = request.header('DGI-API-Key')
    const unix       = request.header('X-Request-Time')
    const api_token  = request.header('DGI-API-Token')
    // Validation
    const validationUnix = Math.floor(new Date() / 1000) - unix
    const TimeValidation = DateCounter(request.body.fromTime, request.body.toTime)
    console.log(TimeValidation)
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
            hash.update(api_key + '' + secret_key.recordset[0].SECRET_KEY + '' + unix)

            const hex = hash.hex()

            if (hex == api_token) {
                const dealerId = await pool.request()
                    .input('API_KEY', SQL.VarChar(250), api_key)
                    .input('SECRET_KEY', SQL.VarChar(250), secret_key.recordset[0].SECRET_KEY)
                    .execute('SP_DGI_API_AUTH')
                const result = await pool.request()
                    .input('dealerId', SQL.VarChar, dealerId.recordset[0].DEALER_ID)
                    .input('fromTime', SQL.VarChar, request.body.fromTime)
                    .input('toTime', SQL.VarChar, request.body.toTime)
                    .input('idSPK', SQL.VarChar, request.body.idSPK)
                    .input('idCustomer', SQL.VarChar, request.body.idCustomer)
                    .execute(Model.getLSNG())
                if (result.recordset.length > 0) {
                    for (var i = 0; i < result.recordset.length; i++) {
                        const bind = {
                            idDokumenPengajuan: result.recordset[i].ID_PENGAJUAN,
                            tanggalSPK: result.recordset[i].TGL_SPK,
                            idSPK: result.recordset[i].NO_SPK,
                            jumlahDP: result.recordset[i].UANG_MUKA,
                            tenor: result.recordset[i].JANGKA_WAKTU,
                            jumlahCicilan: result.recordset[i].JUMLAH_ANGSURAN,
                            tanggalPengajuan: result.recordset[i].TANGGAL,
                            idFinanceCompany: result.recordset[i].KD_FINCOY,
                            namaFinanceCompany: result.recordset[i].NAMA_LEASING,
                            idPOFinanceCompany: result.recordset[i].PO_LEASING,
                            tanggalPembuatanPO: result.recordset[i].TGL_TRANS,
                            tanggalPengirimanPOFinanceCompany: result.recordset[i].PO_DATE,
                            createdTime: result.recordset[i].CREATED_TIME
                        }
                        databinding.push(bind)
                    }
                    var selisih = SelisihTanggal(databinding[0].tanggalSPK)
                    console.log(new Date(Date(selisih)))
                    response.status(200).json({
                        status: 1,
                        message: null,
                        data: databinding.filter(function(index) {
                            return new Date(index.tanggalSPK).getTime() <= new Date(Date(selisih)).getTime()
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