exports.Register = async (data, columns) => {
  try {
    let column = [];
    let obj = data[0];
    if (data.length > 0) {
      let ObjArr = Object.keys(obj);
      columns.map((val) => {
        let fltr = ObjArr.filter((val1) =>
          (val1 === typeof val) === "string" ? val : val[0]
        );
        if (fltr.length > 0) {
          let objtitle = typeof val === "string" ? titleCase(val) : val[1];
          let objfield = typeof val === "string" ? val : val[0];
          let objtext = objfield === 'TotalR' || objfield === 'AmountR' ? "right" : (objfield === 'IsActive' || objfield === 'Closed') ? "center" : "left";

          let Item = {
            title: objtitle,
            field: objfield,
            type: (objfield === 'IsActive' || objfield === 'Closed') ? 'boolean' : 'string',
            headerStyle: {
              paddingTop: 1,
              paddingBottom: 1,
              textAlign: "center",
              fontSize: 14,
              width: (objfield === 'Remarks' || objfield === 'Description') ? "35%" : (objfield === 'PostedBy' || objfield === 'SubmittedBy') ? '15%' : '9%'

            },
            cellStyle: {
              paddingTop: 1,
              paddingBottom: 1,
              textAlign: objtext,
              fontSize: 14,
              width: (objfield === 'Remarks' || objfield === 'Description') ? "35%" : (objfield === 'PostedBy' || objfield === 'SubmittedBy') ? '15%' : '9%'


            },
            width: (objfield === 'Remarks' || objfield === 'Description') ? "35%" : (objfield === 'PostedBy' || objfield === 'SubmittedBy') ? '15%' : '9%'
          };
          column.push(Item);
        }
      });

      return {
        columns: column,
        rows: data,
      };
    }
    else {
      columns.map((val) => {
        let objtitle = typeof val === "string" ? titleCase(val) : val[1];
        let objfield = typeof val === "string" ? val : val[0];
        let objtext = objfield === 'TotalR' ? "right" : (objfield === 'IsActive' || objfield === 'Closed') ? "center" : "left";


        let Item = {
          title: objtitle,
          field: objfield,
          type: (objfield === 'IsActive' || objfield === 'Closed') ? 'boolean' : 'string',
          headerStyle: {
            paddingTop: 1,
            paddingBottom: 1,
            textAlign: "center",
            fontSize: 14,
          },
          cellStyle: {
            paddingTop: 1,
            paddingBottom: 1,
            textAlign: objtext,
            fontSize: 14,
          },
        };
        column.push(Item);
      });
      return {
        columns: column,
        rows: data,
      };
    }

  } catch (err) {
    console.log(err);
  }
};

exports.RegisterDG = async (data, columns) => {
  try {
    let column = [];
    let obj = data[0];
    if (data.length > 0) {
      let ObjArr = Object.keys(obj);
      columns.map((val) => {
        let fltr = ObjArr.filter((val1) =>
          (val1 === typeof val) === "string" ? val : val[0]
        );
        if (fltr.length > 0) {
          let objtitle = typeof val === "string" ? titleCase(val) : val[1];
          let objfield = typeof val === "string" ? val : val[0];
          console.log({objfield})
          let objtext = objfield === 'TotalR' || objfield === 'AmountR' ? "right" : (objfield === 'IsActive' || objfield === 'Closed') ? "center" : "left";

          let Item = {
            headerName: objtitle,
            field: objfield,
            type: (objfield === 'IsActive' || objfield === 'Closed') ? 'boolean' : 'string',
            headerAlign:"center",
            align: objtext,
            width: (objfield === 'Remarks' || objfield === 'Description') ? 500 : (objfield === 'PostedBy' || objfield === 'SubmittedBy') ? 250 : 150
          };
          column.push(Item);
        }
      });

      return {
        columns: column,
        rows: data,
      };
    }
    else {
      columns.map((val) => {
        let objtitle = typeof val === "string" ? titleCase(val) : val[1];
        let objfield = typeof val === "string" ? val : val[0];
        let objtext = objfield === 'TotalR' ? "right" : (objfield === 'IsActive' || objfield === 'Closed') ? "center" : "left";


        let Item = {
          title: objtitle,
          field: objfield,
          type: (objfield === 'IsActive' || objfield === 'Closed') ? 'boolean' : 'string',
          width: (objfield === 'Remarks' || objfield === 'Description') ? "35%" : (objfield === 'PostedBy' || objfield === 'SubmittedBy') ? '15%' : '10%'

        };
        column.push(Item);
      });
      return {
        columns: column,
        rows: data,
      };
    }

  } catch (err) {
    console.log(err);
  }
};

exports.LookUp = async (data, columns) => {
  try {
    let column = [];
    let obj = data[0];
    if (data.length > 0) {
      let ObjArr = Object.keys(obj);
      columns.map((val) => {
        let fltr = ObjArr.filter((val1) =>
          (val1 === typeof val) === "string" ? val : val[0]
        );
        if (fltr.length > 0) {
          let objtitle = typeof val === "string" ? titleCase(val) : val[1];
          let objfield = typeof val === "string" ? val : val[0];
          let objtext = "left";

          let Item = {
            title: objtitle,
            field: objfield,
            headerStyle: {
              paddingTop: 1,
              paddingBottom: 1,
              textAlign: "center"
            },
            cellStyle: {
              paddingTop: 1,
              paddingBottom: 1,
              textAlign: objtext
            }
          };
          column.push(Item);
        }
      });

      return {
        columns: column,
        rows: data,
      };
    }
    else {
      columns.map((val) => {
        let objtitle = typeof val === "string" ? titleCase(val) : val[1];
        let objfield = typeof val === "string" ? val : val[0];
        let objtext = "left";
        let Item = {
          title: objtitle,
          field: objfield,
          headerStyle: {
            paddingTop: 1,
            paddingBottom: 1,
            textAlign: "center",
          },
          cellStyle: {
            paddingTop: 1,
            paddingBottom: 1,
            textAlign: objtext,
          },
        };
        column.push(Item);
      });
      return {
        columns: column,
        rows: data,
      };
    }

  } catch (err) {
    console.log(err);
  }
};

exports.TreeRegister = async (data, columns) => {
  try {
    let column = [];
    let obj = data[0];
    if (data.length > 0) {
      let ObjArr = Object.keys(obj);
      columns.map((val) => {
        let fltr = ObjArr.filter((val1) =>
          (val1 === typeof val) === "string" ? val : val[0]
        );
        if (fltr.length > 0) {
          let objtitle = typeof val === "string" ? titleCase(val) : val[1];
          let objfield = typeof val === "string" ? val : val[0];
          let objtext = "left";

          let Item = {
            title: objtitle,
            field: objfield,
            type: 'string',
            headerStyle: {
              paddingTop: 1,
              paddingBottom: 1,
              textAlign: "center",
              width: objfield === 'Description' ? "65%" : '45%'

            },
            cellStyle: {
              paddingTop: 1,
              paddingBottom: 1,
              textAlign: objtext,
              width: objfield === 'Description' ? "65%" : '45%'
            },
            width: objfield === 'Description' ? "65%" : '45%'
          };
          column.push(Item);
        }
      });

      return {
        columns: column,
        rows: data,
      };
    }
    else {
      columns.map((val) => {
        let objtitle = typeof val === "string" ? titleCase(val) : val[1];
        let objfield = typeof val === "string" ? val : val[0];
        let objtext = "left";


        let Item = {
          title: objtitle,
          field: objfield,
          type: 'string',
          headerStyle: {
            paddingTop: 1,
            paddingBottom: 1,
            textAlign: "center",
          },
          cellStyle: {
            paddingTop: 1,
            paddingBottom: 1,
            textAlign: objtext,
          },
        };
        column.push(Item);
      });
      return {
        columns: column,
        rows: data,
      };
    }

  } catch (err) {
    console.log(err);
  }
};

function titleCase(str) {
  str = str.replace(/([A-Z]+)/g, " $1").trim();
  str = str.replace("_", " ");
  return str;
}

