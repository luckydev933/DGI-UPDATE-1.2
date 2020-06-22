const Controller = require('express').Router()
const DBO = require('../../../modules/database')
const Model = require('../../models/H23/PKBModel')
const Auth = require('../../../modules/Authorization')
const SQL = require('mssql')
const sha256 = require('js-sha256')

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
                    .input('dealerId', SQL.VarChar, dealerId.recordset[0].DEALER_ID)
                    .input('fromTime', SQL.VarChar, request.body.fromTime)
                    .input('toTime', SQL.VarChar, request.body.toTime)
                    .input('noWorkOrder', SQL.VarChar(25), request.body.noWorkOrder)
                    .execute(Model.MasterPKB())
                if (data.recordset.length > 0) {
                    for (var i = 0; i < data.recordset.length; i++) {
                        const bind = {
                            noWorkOrder: data.recordset[i].NO_WO,
                            noSAForm: data.recordset[i].KD_SA,
                            tanggalServis: data.recordset[i].TGL_SERVICE,
                            waktuPKB: data.recordset[i].WAKTU_PKB,
                            noPolisi: data.recordset[i].NO_POLISI,
                            noRangka: data.recordset[i].NO_RANGKA,
                            noMesin: data.recordset[i].NO_MESIN,
                            kodeTipeUnit: data.recordset[i].TIPE_PRODUKSI,
                            tahunMotor: data.recordset[i].TAHUN,
                            informasiBensin: data.recordset[i].BBM,
                            kmTerakhir: data.recordset[i].KM_MOTOR,
                            tipeComingCustomer: data.recordset[i].TY,
                            namaPemilik: data.recordset[i].NAMA_PEMILIK,
                            alamatPemilik: data.recordset[i].ALAMAT_PEMILIK,
                            kodePropinsiPemilik: data.recordset[i].KD_PROPINSI_PEMILIK,
                            kodeKotaPemilik: data.recordset[i].KD_KABUPATEN_PEMILIK,
                            kodeKecamatanPemilik: data.recordset[i].KD_KECAMATAN_PEMILIK,
                            kodeKelurahanPemilik: data.recordset[i].KD_KELURAHAN_PEMILIK,
                            kodePosPemilik: data.recordset[i].KODE_POS_PEMILIK,
                            alamatPembawa: data.recordset[i].ALAMAT_PEMBAWA,
                            kodePropinsiPembawa: data.recordset[i].KD_PROPINSI_PEMBAWA,
                            kodeKotaPembawa: data.recordset[i].KD_KABUPATEN_PEMBAWA,
                            kodeKecamatanPembawa: data.recordset[i].KD_KECAMATAN_PEMBAWA,
                            kodeKelurahanPembawa: data.recordset[i].KD_KELURAHAN_PEMBAWA,
                            kodePosPembawa: data.recordset[i].KODE_POS_PEMBAWA,
                            namaPembawa: data.recordset[i].NAMA_PEMBAWA,
                            noTelpPembawa: data.recordset[i].NO_TELP_PEMBAWA,
                            hubunganDenganPemilik: data.recordset[i].HUB_DENGAN_PEMILIK,
                            keluhanKonsumen: data.recordset[i].KELUHAN_KONSUMEN,
                            rekomendasiSA: data.recordset[i].HASIL_ANALISA_SA,
                            hondaIdSA: data.recordset[i].KD_SA,
                            hondaIdMekanik: data.recordset[i].KD_MEKANIK,
                            saranMekanik: data.recordset[i].SARAN_MEKANIK,
                            asalUnitEntry: data.recordset[i].ASAL_UNIT_ENTRY,
                            idPIT: data.recordset[i].ID_PIT,
                            jenisPIT: data.recordset[i].JENIS_PIT,
                            waktuPendaftaran: data.recordset[i].WAKTU_PENDAFTARAN,
                            waktuSelesai: data.recordset[i].WAKTU_SELESAI,
                            totalFRT: data.recordset[i].TOTAL_FRT,
                            setUpPembayaran: data.recordset[i].SET_UP_PEMBAYARAN,
                            catatanTambahan: data.recordset[i].CATATAN_TAMBAHAN,
                            konfirmasiPekerjaanTambahan: data.recordset[i].KONFIRMASI_PEKERJAANTAMBAHAN,
                            noBukuClaimC2: data.recordset[i].NO_BUKU,
                            noWorkOrderJobReturn: data.recordset[i].NO_WO_RETURN,
                            totalBiayaService: data.recordset[i].HARGA,
                            waktuPekerjaan: data.recordset[i].WAKTU_PEKERJAAN,
                            statusWorkOrder: data.recordset[i].STATUS_PKB,
                            createdTime: data.recordset[i].CREATED_TIME,
                            services: [{
                                idJob: data.recordset[i].ID_JOB_PEKERJAAN,
                                namaPekerjaan: data.recordset[i].NAMA_PEKERJAAN,
                                jenisPekerjaan: data.recordset[i].JENIS_PEKERJAAN,
                                biayaService: data.recordset[i].HARGA_PEKERJAAN,
                                createdTime: data.recordset[i].CREATED_TIME_SERVICE,
                            }],
                            parts: [{
                                idJob: data.recordset[i].ID_JOB_PART,
                                partsNumber: data.recordset[i].PART_NUMBER,
                                kuantitas: data.recordset[i].QTY,
                                hargaParts: data.recordset[i].HARGA_SATUAN,
                                createdTime: data.recordset[i].CREATED_TIME_PART,
                            }]
                        }
                        databinding.push(bind)
                    }
                    var selisih = SelisihTanggal(databinding[0].tanggalServis)
                    response.status(200).json({
                        status: 1,
                        message: null,
                        data: databinding.filter(function(index) {
                            return new Date(index.tanggalServis).getTime() <= new Date(Date(selisih)).getTime()
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