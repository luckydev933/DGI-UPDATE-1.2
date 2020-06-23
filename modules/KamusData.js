// SUMBER PROSPECT
const SumberProspect = function(sumber){
    if(sumber = "NULL"){
        return NULL
    }
    if(sumber = "Pameran"){
        return "0001"
    }
    if(sumber = "Showroom Event"){
        return "0002"
    }
    if(sumber = "Roadshow"){
        return "0003"
    }
    if(sumber = "Walk In"){
        return "0004"
    }
    if(sumber = "Customer RO H1"){
        return "0005"
    }
    if(sumber = "Customer RO H23"){
        return "0006"
    }
    if(sumber = "Website"){
        return "0007"
    }
    if(sumber = "Social Media"){
        return "0008"
    }
    if(sumber = "External parties"){
        return "0009"
    }
    if(sumber = "Mobile Apps"){
        return "0010"
    }
    if(sumber = "Refferal"){
        return "0011"
    }
    if(sumber = "Contact Center"){
        return "0012"
    }
    if(sumber = "Others"){
        return "9999"
    }
}
const MetodeFollowUp = function(method){
    if(sumber = "NULL"){
        return NULL
    }
    if(method = "SMS"){
        return "1"
    }
    if(method = "Call"){
        return "2"
    }
    if(method = "Visit"){
        return "3"
    }
    if(method = "Direct Touch"){
        return "4"
    }
}
const TestRidePreference = function(opt){
    if(sumber = "NULL"){
        return NULL
    }
    if(opt = "Yes"){
        return "1"
    }
    if(opt = "No"){
        return "0"
    }
}
const StatusFollowUp = function(opt){
    if(sumber = "NULL"){
        return NULL
    }
    if(opt = "Planned"){
        return "1"
    }
    if(opt = "Done"){
        return "2"
    }
}
const StatusProspect = function(opt){
    if(sumber = "NULL"){
        return NULL
    }
    if(opt = "Low"){
        return "1"
    }
    if(opt = "Medium"){
        return "2"
    }
    if(opt = "Hot"){
        return "3"
    }
    if(opt = "Deal"){
        return "4"
    }
    if(opt = "Not Deal"){
        return "5"
    }
}
const TipeComingCustomer = function(opt){
    if(sumber = "NULL"){
        return NULL
    }
    if(opt = "Pembawa Motor"){
        return "B"
    }
    if(opt = "Pemakai Motor"){
        return "P"
    }
    if(opt = "Pemilik Motor"){
        return "M"
    }
}
const HubunganDenganPemilik = function(opt){
    if(sumber = "NULL"){
        return NULL
    }
    if(opt = "KEPALA KELUARGA"){
        return "1"
    }
    if(opt = "SUAMI"){
        return "2"
    }
    if(opt = "ISTRI"){
        return "3"
    }
    if(opt = "ANAK"){
        return "4"
    }
    if(opt = "MENANTU"){
        return "5"
    }
    if(opt = "CUCU"){
        return "6"
    }
    if(opt = "ORANG TUA"){
        return "7"
    }
    if(opt = "MERTUA"){
        return "8"
    }
    if(opt = "FAMILI LAIN"){
        return "9"
    }
    if(opt = "PEMBANTU"){
        return "10"
    }
    if(opt = "LAINNYA"){
        return "11"
    }
    if(opt = "PEMILIK"){
        return "0"
    }
}
const AsalUnitEntry = function(opt){
    if(sumber = "NULL"){
        return NULL
    }
    if(opt = "Pit Express"){
        return "AA"
    }
    if(opt = "JDA"){
        return "Reminder"
    }
    if(opt = "Pos Service"){
        return "GC"
    }
    if(opt = "Service Visit Tenda"){
        return "PA"
    }
    if(opt = "Service Visit Mobil"){
        return "OT"
    }
    if(opt = "Service Visit Motor (Honda Home Service)"){
        return "HS"
    }
    if(opt = "AHASS Event"){
        return "AE"
    }
    if(opt = "Walk In"){
        return "WI"
    }
    
}
const JenisPit = function(opt){
    if(sumber = "NULL"){
        return NULL
    }
    if(opt = "Reguler"){
        return "REG"
    }
    if(opt = "Fast Track"){
        return "FT"
    }
    if(opt = "Booking"){
        return "BK"
    }
    if(opt = "Pit Express"){
        return "PE"
    }
    if(opt = "Pit KPB"){
        return "PKPB"
    }

}
const SetUpPembayaran = function(opt){
    if(opt = "NULL"){
        return NULL
    }
    if(opt = "TOP"){
        return "TOP"
    }
    if(opt = "CASH"){
        return "CASH"
    }
    if(opt = "CRED"){
        return "CRED"
    }
    if(opt = "BIL"){
        return "BIL"
    }
    if(opt = "CEK"){
        return "CEK"
    }
    if(opt = "COD"){
        return "COD"
    }
    if(opt = "GOPAY"){
        return "GOPAY"
    }
    if(opt = "OVO"){
        return "OVO"
    }
    if(opt = "KU"){
        return "TRANSFER"
    }
    if(opt = "DANA"){
        return "DANA"
    }
}
const KonfirmasiPekerjaanTambahan = function(opt){
    if(sumber = "NULL"){
        return NULL
    }
    if(opt = "Yes"){
        return "1"
    }
    if(opt = "No"){
        return "0"
    }
}
const StatusWorkOrder = function(opt){
    if(sumber = "NULL"){
        return NULL
    }
    if(opt = "Diapprove"){
        return "1"
    }
    if(opt = "Pengerjaan"){
        return "2"
    }
    if(opt = "Pending"){
        return "3"
    }
    if(opt = "Pembayaran"){
        return "4"
    }
    if(opt = "Dibayar"){
        return "5"
    }
    if(opt = "Menunggu"){
        return "0"
    }
}
// SPK -> Terpenuhi
const StatusSpk = function(opt){
    if(opt = "NULL"){
        return NULL
    }
    if(opt = "Di bayar"){
        return "1"
    }
    if(opt = "Sudah SO"){
        return "2"
    }
    if(opt = "Dikirim Parsial"){
        return "3"
    }
    if(opt = "Dikirim Full"){
        return "4"
    }
    if(opt = "Dikembalikan"){
        return "5"
    }
    if(opt = "Indent"){
        return "6"
    }
    if(opt = "Batal SPK"){
        return "-1"
    }
    
}
const tipePembayaran = function(opt){
    if(sumber = "NULL"){
        return NULL
    }
    if(opt = "Cash"){
        return "cash"
    }
    if(opt = "Cheque"){
        return "Cheque"
    }
    if(opt = "Bank Transfer / KU"){
        return "KU"
    }
    if(opt = "Fintech"){
        return "Fintech"
    }
    if(opt = "COD"){
        return "COD"
    }
    
}
const statusDeliveryDocument = function(opt){
    if(sumber = "NULL"){
        return NULL
    }
    if(opt = "Low"){
        return "low"
    }
    if(opt = "High"){
        return "High"
    }
     if(opt = "Deal"){
        return "Deal"
    }
	if(opt = "Not Deal"){
        return "Not Deal"
    }
}
const statusFakturSTNK = function(opt){
    if(sumber = "NULL"){
        return NULL
    }
     if(opt = "Verifikasi"){
        return "1"
    }
     if(opt = "Approval Biaya"){
        return "2"
    }
     if(opt = "Approval Biaya"){
        return "3"
    }
     if(opt = "Approve kasir"){
        return "4"
    }
     if(opt = "Penerimaan"){
        return "5"
    }
         if(opt = "Penyerahan"){
        return "6"
    }

}

exports.statusFakturSTNK            = statusFakturSTNK
exports.statusDeliveryDocument      = statusDeliveryDocument
exports.tipePembayaran              = tipePembayaran
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