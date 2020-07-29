jenisIdPenerimaBPKB = function(param){
    if(param = "KTP"){
        return 1
    }else if(param = "TDP"){
        return 2
    }else if(param = "Kitas"){
        return 3
    }else if(param = "Passport"){
        return 4
    }else{
        return NULL
    }
}

const StatusFakturSTNK1 = function(param){
    if(param = "Mohon Faktur"){
        return 1
    }else if(param = "Sudah diserahkan ke Biro Jasa"){
        return 2
    }else if(param = "STNK selesai"){
        return 3
    }else if(param = "STNK diserahkan ke konsumen"){
        return 4
    }else if(param = "BPKB selesai"){
        return 5
    }else if(param = "BPKB diserahkan ke konsumen"){
        return 6
    }else if(param = "Plat Nopol selesai"){
        return 7
    }else if(param = "Plat Nopol diserahkan ke konsumen"){
        return 8
    }else {
        return NULL
    }
}
// SUMBER PROSPECT
const SumberProspect = function(sumber){
    if(sumber = "Pameran"){
        return "0001"
    }
    else if(sumber = "Showroom Event"){
        return "0002"
    }
    else if(sumber = "Roadshow"){
        return "0003"
    }
    else if(sumber = "Walk In"){
        return "0004"
    }
    else if(sumber = "Customer RO H1"){
        return "0005"
    }
    else if(sumber = "Customer RO H23"){
        return "0006"
    }
    else if(sumber = "Website"){
        return "0007"
    }
    else if(sumber = "Social Media"){
        return "0008"
    }
    else if(sumber = "External parties"){
        return "0009"
    }
    else if(sumber = "Mobile Apps"){
        return "0010"
    }
    else if(sumber = "Refferal"){
        return "0011"
    }
    else if(sumber = "Contact Center"){
        return "0012"
    }
    else if(sumber = "Others"){
        return "9999"
    }else{
        return NULL
    }
}
const MetodeFollowUp = function(method){
    if(method = "SMS"){
        return "1"
    }
    else if(method = "Call"){
        return "2"
    }
    else if(method = "Visit"){
        return "3"
    }
    else if(method = "Direct Touch"){
        return "4"
    }else{
        return NULL
    }
}
const TestRidePreference = function(opt){
    if(opt = "Yes"){
        return "1"
    }
    else if(opt = "No"){
        return "0"
    }else{
        return NULL
    }
}
const StatusFollowUp = function(opt){
    if(opt = "Planned"){
        return "1"
    }
    else if(opt = "Done"){
        return "2"
    }else{
        return NULL
    }
}
const StatusProspect = function(opt){
    if(opt = "Low"){
        return "1"
    }
    else if(opt = "Medium"){
        return "2"
    }
    else if(opt = "Hot"){
        return "3"
    }
    else if(opt = "Deal"){
        return "4"
    }
    else if(opt = "Not Deal"){
        return "5"
    }else{
        return NULL
    }
}
const TipeComingCustomer = function(opt){
    if(opt = "Pembawa Motor"){
        return "B"
    }
    else if(opt = "Pemakai Motor"){
        return "P"
    }
    else if(opt = "Pemilik Motor"){
        return "M"
    }else{
        return NULL
    }
}
const HubunganDenganPemilik = function(opt){
    if(opt = "KEPALA KELUARGA"){
        return "1"
    }
    else if(opt = "SUAMI"){
        return "2"
    }
    else if(opt = "ISTRI"){
        return "3"
    }
    else if(opt = "ANAK"){
        return "4"
    }
    else if(opt = "MENANTU"){
        return "5"
    }
    else if(opt = "CUCU"){
        return "6"
    }
    else if(opt = "ORANG TUA"){
        return "7"
    }
    else if(opt = "MERTUA"){
        return "8"
    }
    else if(opt = "FAMILI LAIN"){
        return "9"
    }
    else if(opt = "PEMBANTU"){
        return "10"
    }
    else if(opt = "LAINNYA"){
        return "11"
    }
    else if(opt = "PEMILIK"){
        return "0"
    }else{
        return NULL
    }
}
const AsalUnitEntry = function(opt){
    if(opt = "Pit Express"){
        return "AA"
    }
    else if(opt = "JDA"){
        return "Reminder"
    }
    else if(opt = "Pos Service"){
        return "GC"
    }
    else if(opt = "Service Visit Tenda"){
        return "PA"
    }
    else if(opt = "Service Visit Mobil"){
        return "OT"
    }
    else if(opt = "Service Visit Motor (Honda Home Service)"){
        return "HS"
    }
    else if(opt = "AHASS Event"){
        return "AE"
    }
    else if(opt = "Walk In"){
        return "WI"
    }else{
        return NULL
    }
    
}
const JenisPit = function(opt){
    if(opt = "Reguler"){
        return "REG"
    }
    else if(opt = "Fast Track"){
        return "FT"
    }
    else if(opt = "Booking"){
        return "BK"
    }
    else if(opt = "Pit Express"){
        return "PE"
    }
    else if(opt = "Pit KPB"){
        return "PKPB"
    }else{
        return NULL
    }

}
const SetUpPembayaran = function(opt){
    if(opt = "TOP"){
        return "TOP"
    }
    else if(opt = "CASH"){
        return "CASH"
    }
    else if(opt = "CRED"){
        return "CRED"
    }
    else if(opt = "BIL"){
        return "BIL"
    }
    else if(opt = "CEK"){
        return "CEK"
    }
    else if(opt = "COD"){
        return "COD"
    }
    else if(opt = "GOPAY"){
        return "GOPAY"
    }
    else if(opt = "OVO"){
        return "OVO"
    }
    else if(opt = "KU"){
        return "TRANSFER"
    }
    else if(opt = "DANA"){
        return "DANA"
    }else{
        return NULL
    }
}
const KonfirmasiPekerjaanTambahan = function(opt){
    if(opt = "Yes"){
        return "1"
    }
    else if(opt = "No"){
        return "0"
    }else{
        return NULL
    }
}
const StatusWorkOrder = function(opt){
    if(opt = "Diapprove"){
        return "1"
    }
    else if(opt = "Pengerjaan"){
        return "2"
    }
    else if(opt = "Pending"){
        return "3"
    }
    else if(opt = "Pembayaran"){
        return "4"
    }
    else if(opt = "Dibayar"){
        return "5"
    }
    else if(opt = "Menunggu"){
        return "0"
    }else{
        return NULL
    }
}
// SPK -> Terpenuhi
const StatusSpk = function(opt){
    if(opt = "Di bayar"){
        return "1"
    }
    else if(opt = "Sudah SO"){
        return "2"
    }
    else if(opt = "Dikirim Parsial"){
        return "3"
    }
    else if(opt = "Dikirim Full"){
        return "4"
    }
    else if(opt = "Dikembalikan"){
        return "5"
    }
    else if(opt = "Indent"){
        return "6"
    }
    else if(opt = "Batal SPK"){
        return "-1"
    }else{
        return NULL
    }
    
}
const tipePembayaran = function(opt){
    if(opt = "Cash"){
        return "cash"
    }
    else if(opt = "Cheque"){
        return "Cheque"
    }
    else if(opt = "Bank Transfer / KU"){
        return "KU"
    }
    else if(opt = "Fintech"){
        return "Fintech"
    }
    else if(opt = "COD"){
        return "COD"
    }else{
        return NULL
    }
    
}
const statusDeliveryDocument = function(opt){
    if(opt = "Low"){
        return "low"
    }
    else if(opt = "High"){
        return "High"
    }
    else if(opt = "Deal"){
        return "Deal"
    }
	else if(opt = "Not Deal"){
        return "Not Deal"
    }else{
        return NULL
    }
}
const statusFakturSTNK = function(opt){
    if(opt = "Verifikasi"){
        return "1"
    }
    else if(opt = "Approval Biaya"){
        return "2"
    }
    else if(opt = "Approval Biaya"){
        return "3"
    }
    else if(opt = "Approve kasir"){
        return "4"
    }
    else if(opt = "Penerimaan"){
        return "5"
    }
    else if(opt = "Penyerahan"){
        return "6"
    }else{
        return NULL
    }

}
const statusShippingList = function(param){
    if(param = "Sudah diterima"){
        return "1"
    }else if(param = "Belum diterima"){
        return "2"
    }else{
        return NULL
    }
}

const statusRFS = function(param){
    if(param = "RFS"){
        return "1"
    }else if(param = "NRFS"){
        return "0"
    }else{
        return NULL
    }
}

//exports.statusFakturSTNK            = statusFakturSTNK
exports.statusDeliveryDocument      = statusDeliveryDocument
exports.statusShippingList          = statusShippingList
exports.tipePembayaran              = tipePembayaran
exports.statusRFS                   = statusRFS
exports.StatusSpk                   = StatusSpk
exports.StatusWorkOrder             = StatusWorkOrder
exports.KonfirmasiPekerjaanTambahan = KonfirmasiPekerjaanTambahan
exports.SetUpPembayaran             = SetUpPembayaran
exports.JenisPit                    = JenisPit
exports.AsalUnitEntry               = AsalUnitEntry
exports.HubunganDenganPemilik       = HubunganDenganPemilik
exports.TipeComingCustomer          = TipeComingCustomer
exports.SumberProspect              = SumberProspect
exports.MetodeFollowUp              = MetodeFollowUp
exports.StatusFollowUp              = StatusFollowUp
exports.StatusProspect              = StatusProspect
exports.TestRidePreference          = TestRidePreference
exports.StatusFakturSTNK            = StatusFakturSTNK1
exports.jenisIdPenerimaBPKB         = jenisIdPenerimaBPKB