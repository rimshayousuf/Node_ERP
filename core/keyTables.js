let DataArray = [
{ key:"FIN_AgingBuckets", value:''},
{ key:"FIN_AgingBucketsDays", value:''},
{ key:"FIN_Bank", value:''},
{ key:"FIN_BudgetLines", value:''},
{ key:"FIN_Budgets", value:''},
{ key:"FIN_Cards", value:''},
{ key:"FIN_Categories", value:''},
{ key:"FIN_CodeCombination", value:''},
{ key:"FIN_Currencies", value:''},
{ key:"FIN_CustomerAddress", value:''},
{ key:"FIN_CustomerCategories", value:''},
{ key:"FIN_CustomerProfiles", value:''},
{ key:"FIN_Customers", value:''},
{ key:"FIN_CustomerTerritories", value:''},
{ key:"FIN_ExchRates", value:''},
{ key:"FIN_FiscalPeriod", value:''},
{ key:"FIN_FiscalYear", value:''},
{ key:"FIN_Jobs", value:'JobCode'},
{ key:"FIN_LCCategories", value:''},
{ key:"FIN_LCCodes", value:''},
{ key:"FIN_PayModes", value:'PayModeCode'},
{ key:"FIN_PayTerms", value:'PayTermCode'},
{ key:"FIN_Seg1", value:'VSCode'},
{ key:"FIN_Seg2", value:'VSCode'},
{ key:"FIN_Seg3", value:'VSCode'},
{ key:"FIN_ShippingMethods", value:'ShippingMethodCode'},
{ key:"FIN_Sources", value:'SrcCode'},
{ key:"FIN_TaxDetail", value:'TaxDetailCode'},
{ key:"FIN_TaxSchedule", value:'TaxScheduleCode'},
{ key:"FIN_VendorCategory", value:'VendCategoryCode'},
{ key:"FIN_VendorProfiles", value:'VendorProfileCode'},
{ key:"FIN_Vendors", value:'VendorCode'},
{ key:"INV_AttributeCode", value:'AttCode'},
{ key:"INV_AttributeHead", value:'AttHeadCode'},
{ key:"INV_Item", value:'ItemCode'},
{ key:"INV_ItemClass", value:'ItemClassCode'},
{ key:"INV_Location", value:'LocationCode'},
{ key:"INV_UOMDetail", value:'UOMCode'},
{ key:"INV_UOMHeader", value:'UOMHeaderCode'},
{ key:"MOP_BOMHeader", value:'BOMID'},
{ key:"MOP_Machine", value:'MachineCode'},
{ key:"MOP_RoutingHeader", value:'RoutingCode'},
{ key:"MOP_Stages", value:'StageCode'}]


exports.UseCount = async (req, res) => {

    let Header = req.body.Header;
    let Detail = req.body.Detail ? req.body.Detail : [] 

}