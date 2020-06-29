const Controller = require('express').Router()
const DBO = require('../../../modules/database')
const Model = require('../../models/H1/INV1Model')
const SQL = require('mssql')
const sha256 = require('js-sha256')
const Kamus = require('../../../modules/KamusData')

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

Controller.post('/read', async function(request, response){
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
                const inv = await pool.request()
                    .input('dealerId', SQL.VarChar, dealerId.recordset[0].DEALER_ID)
                    .input('dealer', SQL.VarChar, request.body.dealerId)
                    .input('dealer', SQL.VarChar, request.body.dealerId)
                    .input('fromTime', SQL.VarChar, request.body.fromTime)
                    .input('toTime', SQL.VarChar, request.body.toTime)
                    .input('idCustomer', SQL.VarChar(25), request.body.idCustomer)
                    .execute('SP_DGI_API_INV1_PULL')
                if (inv.recordset.length > 0) {
                    for (var i = 0; i < inv.recordset.length; i++) {
                        const bind = {
                            idInvoice: inv.recordset[i].NO_TRANS,
                            idSPK: inv.recordset[i].NO_SPK,
                            idCustomer: inv.recordset[i].KD_CUSTOMER,
                            Amount: inv.recordset[i].HARGA,
                            tipePembayaran: Kamus.tipePembayaran(inv.recordset[i].CARA_BAYAR),
                            caraBayar: Kamus.tipePembayaran(inv.recordset[i].CARA_BAYAR),
                            Status: Kamus.StatusSpk(inv.recordset[i].STATUS_SPK),
                            Note: inv.recordset[i].KETERANGAN,
                            dealerId: inv.recordset[i].KD_DEALERAHM,
                            createdTime: inv.recordset[i].CREATED_TIME,
                            modifiedTime: inv.recordset[i].MODTIME,
                            tgl_transaksi: inv.recordset[i].TGL_TRANSAKSI
                        }
                        databinding.push(bind)
                    }
                    var selisih = SelisihTanggal(databinding[0].tgl_transaksi)
                    response.status(200).json({
                        status: 1,
                        message: null,
                        data: databinding.filter(function(index) {
                            return new Date(index.tgl_transaksi).getTime() <= new Date(Date(selisih)).getTime()
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
Controller.post('/add', async function(request, response) {
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