

exports.NextNo = async function (model,FormName,t) {
    try {
        let NextNo
        let TransType = await model.findOne({ where: { TransID: FormName },transaction:t })
        
        NextNo = TransType.NextNo;
        let response = NextNo.split("-");
        let newNo = ("0".repeat(parseInt(TransType.DocLength) - 1) + (parseInt(response[1]) + 1)).slice(
            parseInt(TransType.DocLength) * -1
        );
        let NextTransNo = response[0] + "-" + newNo;

        await model.update({NextNo: NextTransNo}, { where: { TransID: FormName },transaction:t })
                
        return NextNo;
    }
    catch (ex) {
        console.log(ex)
        return ""
    }
};