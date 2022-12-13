
const sql = require("sqlstring");

let data = [];
let obj3 = {};

exports.roles = function (req, resp) {
    var Data1 = Datafilter(req, function (level1) {
        return level1.ControlType === "Menu";
    });

    data.length = 0;
    Data1.sort(compare)
    Data1.forEach(function (value) {
        let obj = {
            id: value.ControlID.toString(),
            parentId: value.PCID,
            label: value.ControlName,
            formType: value.FormType,
            data: value.ControlName,
            items: []
        };

        var Data2 = Datafilter(req, function (level2) {
            return level2.PCID === value.ControlID;
        });

        Data2.sort(compare)
        Data2.forEach(function (value2) {
            let obj2 = {
                id: value2.ControlID.toString(),
                parentId: value2.PCID,
                label: value2.ControlName,
                data: value2.ControlName
            }

            if (obj.label == 'Security' || obj2.label == 'Transaction' || obj2.label == 'Setup') {
                obj2.Create = value2.GET ? Number(value2.Create) : 0;
                obj2.Edit = value2.GET ? Number(value2.Edit) : 0;
                obj2.View = value2.GET ? Number(value2.View) : 0;
                obj2.Delete = value2.GET ? Number(value2.Delete) : 0;

                if (obj2.label == 'Transaction') {
                    obj2.Post = value2.GET ? Number(value2.Post) : 0;
                }
            }
            else {
                if (obj2.label == 'Utilities') {
                    obj2.Process = value2.GET ? Number(value2.Post) : 0;
                }
                else {
                    obj2.View = value2.GET ? Number(value2.View) : 0;
                }
            }
            
            
            obj.items.push(obj2);


            var Data3 = Datafilter(req, function (level3) {
                return level3.PCID === value2.ControlID;
            });


            Data3.sort(compare)
            Data3.forEach(function (value3) {
                let obj3 = {
                    id: value3.ControlID.toString(),
                    parentId: value3.PCID,
                    label: value3.ControlName,
                    data: value3.ControlName
                }
    
                if (obj2.label == 'Transaction' || obj2.label == 'Setup') {
                    obj3.Create = value3.GET ? Number(value3.Create) : 0;
                    obj3.Edit = value3.GET ? Number(value3.Edit) : 0;
                    obj3.View = value3.GET ? Number(value3.View) : 0;
                    obj3.Delete = value3.GET ? Number(value3.Delete) : 0;
    
                    if (obj2.label == 'Transaction') {
                        obj3.Post = value3.GET ? Number(value3.Post) : 0;
                    }
                }
                else {
                    if (obj2.label == 'Utilities') {
                        obj3.Process = value3.GET ? Number(value3.Post) : 0;
                    }
                    else {
                        obj3.View = value3.GET ? Number(value3.View) : 0;
                    }
                }

                obj.items.push(obj3);
            });
        });
        data.push(obj);
    });

    var JSONdata = JSON.stringify(data);
    resp = JSON.parse(JSONdata);
    return resp;
};

// exports.roles = function (req, resp) {
//     let Data1 = Datafilter(req, function (level1) {
//         return level1.ControlType === "Menu";
//     });

//     data.length = 0;
//     Data1.sort(compare)
//     Data1.forEach(function (value) {
//         let obj = {
//             id: value.ControlID.toString(),
//             parentId: value.PCID,
//             label: value.ControlName,
//             data: value.ControlName,
//             items: []
//         };

//         let Data2 = Datafilter(req, function (level2) {
//             return level2.PCID === value.ControlID;
//         });

//         Data2.sort(compare)

//         Data2.forEach(function (value2) {
//             let obj2 = {}
//             obj2 = {
//                 id: value2.ControlID.toString(),
//                 parentId: value2.PCID,
//                 label: value2.ControlName,
//                 data: value2.ControlName
//             }

//             let Data3 = Datafilter(req, function (level3) {
//                 return level3.PCID === value2.ControlID;
//             });

//             if (obj.label !== 'Security') {
//                 obj2.items = []
//             }
//             else {
//                 obj2.Create = value2.GET ? Number(value2.Create) : 0;
//                 obj2.Edit = value2.GET ? Number(value2.Edit) : 0;
//                 obj2.View = value2.GET ? Number(value2.View) : 0;
//                 obj2.Delete = value2.GET ? Number(value2.Delete) : 0;
//             }

//                 if (obj2.label === 'Reports'){
//                     obj2.View = value2.GET ? Number(value2.View) : 0;
//                 }
//                 else if (obj2.label === 'Utilities'){
//                     obj2.Process = value2.GET ? Number(value3.Post) : 0
//                 }
//                 else if (obj2.label === 'Transaction'){
//                     obj2.Create = value2.GET ? Number(value2.Create) : 0
//                     obj2.View = value2.GET ? Number(value2.View) : 0
//                     obj2.Edit = value2.GET ? Number(value2.Edit) : 0
//                     obj2.Delete = value2.GET ? Number(value2.Delete) : 0
//                     obj2.Post = value2.GET ? Number(value2.Post) : 0
//                 }
//                 else {
//                     obj2.Create = value2.GET ? Number(value2.Create) : 0
//                     obj2.View = value2.GET ? Number(value2.View) : 0
//                     obj2.Edit = value2.GET ? Number(value2.Edit) : 0
//                     obj2.Delete = value2.GET ? Number(value2.Delete) : 0
//                 }

//             obj.items.push(obj2);
//         });
//         data.push(obj);
//     });

//     let JSONdata = JSON.stringify(data);
//     resp = JSON.parse(JSONdata);
//     return resp;
// };


function Datafilter(array, test) {
    let passedTest = [];
    for (let i = 0; i < array.length; i++) {
        if (test(array[i])) passedTest.push(array[i]);
    }

    return passedTest;
}

function compare(a, b) {
    const sortA = a.SortOrder;
    const sortB = b.SortOrder;

    let comparison = 0;
    if (sortA > sortB) {
        comparison = 1;
    } else if (sortA < sortB) {
        comparison = -1;
    }
    return comparison;
}