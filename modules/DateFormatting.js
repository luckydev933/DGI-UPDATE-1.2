module.exports = {
    FormatDate : function(param){
        const Base = new Date(param).toLocaleString()
        const Split = Base.split(",")
        const date = Split[0].split("/")
        if(date[1] = "1"){
            return date[0]+"/01/"+date[2]+" "+Split[1]
        }
        if(date[1] = "2"){
            return date[0]+"/02/"+date[2]+" "+Split[1]
        }
        if(date[1] = "3"){
            return date[0]+"/03/"+date[2]+" "+Split[1]
        }
        if(date[1] = "4"){
            return date[0]+"/04/"+date[2]+" "+Split[1]
        }
        if(date[1] = "5"){
            return date[0]+"/05/"+date[2]+" "+Split[1]
        }
        if(date[1] = "6"){
            return date[0]+"/06/"+date[2]+" "+Split[1]
        }
        if(date[1] = "7"){
            return date[0]+"/07/"+date[2]+" "+Split[1]
        }
        if(date[1] = "8"){
            return date[0]+"/08/"+date[2]+" "+Split[1]
        }
        if(date[1] = "9"){
            return date[0]+"/09/"+date[2]+" "+Split[1]
        }
        if(date[1] = "10"){
            return date[0]+"/10/"+date[2]+" "+Split[1]
        }
        if(date[1] = "11"){
            return date[0]+"/11/"+date[2]+" "+Split[1]
        }
        if(date[1] = "12"){
            return date[0]+"/12/"+date[2]+" "+Split[1]
        }
    },
    FormatTime : function(param){
        const Base = new Date(param).toLocaleString()
        const Split = Base.split(",")
        const date = Split[0].split("/")
        if(date[0] = "1"){
            return "01/"+date[1]+"/"+date[2]+" "+Split[1]
        }
        if(date[0] = "2"){
            return "02/"+date[1]+"/"+date[2]+" "+Split[1]
        }
        if(date[0] = "3"){
            return "03/"+date[1]+"/"+date[2]+" "+Split[1]
        }
        if(date[0] = "4"){
            return "04/"+date[1]+"/"+date[2]+" "+Split[1]
        }
        if(date[0] = "5"){
            return "05/"+date[1]+"/"+date[2]+" "+Split[1]
        }
        if(date[0] = "6"){
            return "06/"+date[1]+"/"+date[2]+" "+Split[1]
        }
        if(date[0] = "7"){
            return "07/"+date[1]+"/"+date[2]+" "+Split[1]
        }
        if(date[0] = "8"){
            return "08/"+date[1]+"/"+date[2]+" "+Split[1]
        }
        if(date[0] = "9"){
            return "09/"+date[1]+"/"+date[2]+" "+Split[1]
        }
        if(date[0] = "10"){
            return "10/"+date[1]+"/"+date[2]+" "+Split[1]
        }
        if(date[0] = "11"){
            return "11/"+date[1]+"/"+date[2]+" "+Split[1]
        }
        if(date[0] = "12"){
            return "12/"+date[1]+"/"+date[2]+" "+Split[1]
        }
        if(date[0] = "13"){
            return "13/"+date[1]+"/"+date[2]+" "+Split[1]
        }
        if(date[0] = "14"){
            return "14/"+date[1]+"/"+date[2]+" "+Split[1]
        }
        if(date[0] = "15"){
            return "15/"+date[1]+"/"+date[2]+" "+Split[1]
        }
        if(date[0] = "16"){
            return "16/"+date[1]+"/"+date[2]+" "+Split[1]
        }
        if(date[0] = "17"){
            return "17/"+date[1]+"/"+date[2]+" "+Split[1]
        }
        if(date[0] = "18"){
            return "18/"+date[1]+"/"+date[2]+" "+Split[1]
        }
        if(date[0] = "19"){
            return "19/"+date[1]+"/"+date[2]+" "+Split[1]
        }
        if(date[0] = "20"){
            return "20/"+date[1]+"/"+date[2]+" "+Split[1]
        }
        if(date[0] = "21"){
            return "21/"+date[1]+"/"+date[2]+" "+Split[1]
        }
        if(date[0] = "22"){
            return "22/"+date[1]+"/"+date[2]+" "+Split[1]
        }
        if(date[0] = "23"){
            return "23/"+date[1]+"/"+date[2]+" "+Split[1]
        }
        if(date[0] = "24"){
            return "24/"+date[1]+"/"+date[2]+" "+Split[1]
        }
        if(date[0] = "25"){
            return "25/"+date[1]+"/"+date[2]+" "+Split[1]
        }
        if(date[0] = "26"){
            return "26/"+date[1]+"/"+date[2]+" "+Split[1]
        }
        if(date[0] = "27"){
            return "27/"+date[1]+"/"+date[2]+" "+Split[1]
        }
        if(date[0] = "28"){
            return "28/"+date[1]+"/"+date[2]+" "+Split[1]
        }
        if(date[0] = "29"){
            return "29/"+date[1]+"/"+date[2]+" "+Split[1]
        }
        if(date[0] = "30"){
            return "30/"+date[1]+"/"+date[2]+" "+Split[1]
        }
        if(date[0] = "31"){
            return "31/"+date[1]+"/"+date[2]+" "+Split[1]
        }
    }
}