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

exports.SumberProspect     = SumberProspect
exports.MetodeFollowUp     = MetodeFollowUp
exports.StatusFollowUp     = StatusFollowUp
exports.StatusProspect     = StatusProspect
exports.TestRidePreference = TestRidePreference