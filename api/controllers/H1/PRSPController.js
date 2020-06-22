const Controller = require('express').Router()
const DBO = require('../../../modules/database')
const Model = require('../../models/H1/PRSPModel')
const SQL = require('mssql')
const sha256 = require('js-sha256')

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
                const data = await pool.request()
                    .input('dealerId', SQL.Int, dealerId.recordset[0].DEALER_ID)
                    .input('fromTime', SQL.VarChar, request.body.fromTime)
                    .input('toTime', SQL.VarChar, request.body.toTime)
                    .input('idProspect', SQL.VarChar, request.body.idProspect)
                    .input('idSalesPeople', SQL.VarChar, request.body.idSalesPeople)
                    .execute(Model.PRSP())
                if (data.recordset.length > 0) {
                    for (var i = 0; i < data.recordset.length; i++) {
                        const bind = {
                            idProspect: data.recordset[i].NO_PROSPECT,
                            sumberProspect: data.recordset[i].SUMBER_PROS,
                            tanggalProspect: data.recordset[i].TGL_PROSPECT,
                            taggingProspect: data.recordset[i].PRIORITAS,
                            namaLengkap: data.recordset[i].NAMA_CUST,
                            noKontak: data.recordset[i].NOHP_CUST,
                            noKtp: data.recordset[i].NO_KTP,
                            alamat: data.recordset[i].ALAMAT_CUST,
                            kodePropinsi: data.recordset[i].KD_PROV_CUST,
                            kodeKota: data.recordset[i].KD_KAB_CUST,
                            kodeKecamatan: data.recordset[i].KD_KEC_CUST,
                            kodeKelurahan: data.recordset[i].KD_KEL_CUST,
                            kodePos: data.recordset[i].KD_POS_CUST,
                            latitude: data.recordset[i].LATITUDE_PROS,
                            longitude: data.recordset[i].LONGITUDE_PROS,
                            alamatKantor: data.recordset[i].ALAMAT_KTR,
                            kodePropinsiKantor: data.recordset[i].KD_PROV_KTR,
                            kodeKotaKantor: data.recordset[i].KD_KAB_KTR,
                            kodeKecamatanKantor: data.recordset[i].KD_KEC_KTR,
                            KodeKelurahanKantor: data.recordset[i].KD_KEL_KTR,
                            kodePosKantor: data.recordset[i].KD_POS_KTR,
                            kodePekerjaan: data.recordset[i].KD_PEKERJAAN,
                            noKontakKantor: data.recordset[i].TELP_KTR,
                            tanggalAppointment: data.recordset[i].TGL_APPOINTMENT,
                            waktuAppointment: data.recordset[i].WAKTU_APPOINTMENT,
                            metodeFollowUp: data.recordset[i].METODE_FU,
                            testRidePreference: data.recordset[i].TEST_DRIVE,
                            statusFollowUpProspecting: data.recordset[i].STATUS_FU,
                            statusProspect: data.recordset[i].STATUS_PROS,
                            idSalesPeople: data.recordset[i].KD_SALES,
                            idEvent: data.recordset[i].KD_EVENT,
                            unit: [{
                                kodeTipeUnit: data.recordset[i].KD_TYPEMOTOR,
                                salesProgramId: data.recordset[i].KD_SALESPROGRAM,
                                createdTime: data.recordset[i].CREATED_TIME
                            }]
                        }
                        databinding.push(bind)
                    }
                    var selisih = SelisihTanggal(databinding[0].tanggalProspect)
                    response.status(200).json({
                        status: 1,
                        message: null,
                        data: databinding.filter(function(index) {
                            return new Date(index.tanggalProspect).getTime() <= new Date(Date(selisih)).getTime()
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