const Controller = require('express').Router()
const DBO = require('../../../modules/database')
const Model = require('../../models/H1/SPKModel')
const SQL = require('mssql')
const sha256 = require('js-sha256')
const Kamus = require('../../../modules/KamusData')

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

function DateParser(date){
    const DateString = date.split(",")
    const SPDate     = DateString[0].split("-")
    const SPString   = SPDate[0]+''+SPDate[1]+''+SPDate[2]
    return SPString
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

function TanggalSPK(date){
    var MyDate = new Date(date);
var MyDateString;

MyDateString = ('0' + MyDate.getDate()).slice(-2) + '/'
             + ('0' + (MyDate.getMonth()+1)).slice(-2) + '/'
             + MyDate.getFullYear();
return MyDateString
}

Controller.post('/', async function(request, response){
    console.log(DateParser(request.body.fromTime))

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
                    input('fromTime', SQL.VarChar, request.body.fromTime).
                    input('toTime', SQL.VarChar, request.body.toTime).
                    input('idSalesPeople', SQL.VarChar, request.body.idSalesPeople).
                    execute('SP_DGI_API_SPK')
                    if(result.recordset.length >0){
                        for(var i = 0; i < result.recordset.length; i++){
                                const bind = {
                                    dealerId: result.recordset[i].KD_DEALERAHM,
                                    idSpk: result.recordset[i].NO_SPK,
                                    idProspect: result.recordset[i].NO_PROSPECT,
                                    namaCustomer: result.recordset[i].NAMA_CUSTOMER,
                                    noKtp: result.recordset[i].NO_KTP,
                                    alamat: result.recordset[i].ALAMAT_SURAT,
                                    kodePropinsi: result.recordset[i].KD_PROPINSI,
                                    kodeKota: result.recordset[i].KD_KOTA,
                                    kodeKecamatan: result.recordset[i].KD_KECAMATAN,
                                    kodeKelurahan: result.recordset[i].KD_KELURAHAN,
                                    kodePos: result.recordset[i].KODE_POS,
                                    noKontak: result.recordset[i].NO_HP,
                                    namaBPKB: result.recordset[i].NAMA_BPKB,
                                    noKTPBPKB: result.recordset[i].KTP_BPKB,
                                    alamatBPKB: result.recordset[i].ALAMAT_BPKB,
                                    kodePropinsiBPKB: result.recordset[i].KD_PROPINSI_BPKB,
                                    kodeKotaBPKB: result.recordset[i].KD_KABUPATEN_BPKB,
                                    kodeKecamatanBPKB: result.recordset[i].KD_KECAMATAN_BPKB,
                                    kodeKelurahanBPKB: result.recordset[i].KD_KELURAHAN_BPKB,
                                    kodePosBPKB: result.recordset[i].KODE_POS_BPKB,
                                    latitude: result.recordset[i].LATITUDE,
                                    longitude: result.recordset[i].LONGITUDE,
                                    NPWP: result.recordset[i].NO_NPWP,
                                    noKK: result.recordset[i].NO_KK,
                                    alamatKK: result.recordset[i].ALAMAT_KK,
                                    kodePropinsiKK: result.recordset[i].KD_PROPINSI_KK,
                                    kodeKotaKK: result.recordset[i].KD_KABUPATEN_KK,
                                    kodeKecamatanKK: result.recordset[i].KD_KECAMATAN_KK,
                                    kodeKelurahanKK: result.recordset[i].KD_DESA_KK,
                                    kodePosKK: result.recordset[i].KD_POS_KK,
                                    fax: result.recordset[i].NO_FAX,
                                    email: result.recordset[i].EMAIL,
                                    idSalesPeople: result.recordset[i].KD_SALES,
                                    idEvent: result.recordset[i].KD_EVENT,
                                    tanggalPesanan: result.recordset[i].TGL_SPK,
                                    statusSPK: Kamus.StatusSpk(result.recordset[i].STATUS_SPK),
                                    dealerId: result.recordset[i].KD_DEALERAHM,
                                    createdTime: result.recordset[i].CREATED_TIME,
                                    modifiedTime: result.recordset[i].MODTIME,
                                    unit: [
                                        {
                                            kodeTipeUnit: result.recordset[i].KD_TYPEMOTOR,
                                            kodeWarna: result.recordset[i].KD_WARNA,
                                            quantity: result.recordset[i].JUMLAH,
                                            hargaJual: result.recordset[i].HARGA,
                                            diskon: result.recordset[i].DISKON,
                                            amountPPN: result.recordset[i].KD_PPN,
                                            fakturPajak: result.recordset[i].FAKTUR_PAJAK,
                                            tipePembayaran: Kamus.tipePembayaran(result.recordset[i].CARA_BAYAR),
                                            jumlahTandaJadi: result.recordset[i].HARGA_JADI,
                                            tanggalPengiriman: result.recordset[i].TGL_KIRIM,
                                            idSalesProgram: result.recordset[i].KD_SALESPROGRAM,
                                            idApparel: result.recordset[i].NAMA_HADIAH,
                                            createdTime: result.recordset[i].CREATED_TIME_PROSPECT,
                                            modifiedTime: result.recordset[i].MODTIME_UNIT
                                        }
                                    ],
                                    dataAnggotaKeluarga: [
                                        {
                                            anggotaKK: result.recordset[i].NAMA_ANGGOTA,
                                            createdTime: result.recordset[i].CREATED_TIME
                                        }
                                    ]
                                }
                                databinding.push(bind)
 
                        }
                        const filter = []
                        const tanggal = new Date(databinding[0].tanggalPesanan).toLocaleString()
                        const pisah = tanggal.split(",")
                        const Tanggalspk = TanggalSPK(pisah[0])
                        console.log('Tanggal SPK : '+Tanggalspk)
                        // ar pisah = tanggal.split()v
                        var selisih = SelisihTanggal(databinding[0].tanggalPesanan)
                        console.log(new Date(databinding[0].tanggalPesanan).toLocaleString())
                        const dataFilter = databinding.filter(function(index){
                                const tanggal = new Date(index.tanggalPesanan).toLocaleString()
                                const pisah = tanggal.split(",")
                                const Tanggalspk = TanggalSPK(pisah[0])
                                return new Date(Tanggalspk).getTime() <= new Date(selisih).getTime()
                        })
                        response.set({
                            'X-Response-Message': 'null',
                            'X-Response-Dealer': secret_key.recordset[0].DEALER_ID,
                            'X-Response-Count': dataFilter.length
                        })
                        console.log(selisih)
                        console.log(databinding[0].tanggalPesanan)
                        console.log(filter.length)
                        response.status(200).json({
                            status: 1,
                            message: null,
                            data: databinding.filter(function(index){
                                const tanggal = new Date(index.tanggalPesanan).toLocaleString()
                                const pisah = tanggal.split(",")
                                const Tanggalspk = TanggalSPK(pisah[0])
                                console.log(new Date(Tanggalspk))
                                console.log(Tanggalspk)
                                return new Date(Tanggalspk).getTime() <= new Date(selisih).getTime()
                            })
                        })
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