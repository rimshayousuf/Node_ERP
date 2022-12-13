const AppConfig = require('./../../AppConfig');
const Sequelize = require('sequelize');
const Op = Sequelize.Op

exports.Allocation = async (db, model, TransNo, TransDate, TransType, LocationCode, Posted) => {
    try {

        let PostedData = Posted ? true : false

        let DetailData = await model.findAll({ where: { TransNo: TransNo } })

        let UPD = "EXEC [dbo].[UpdateParallelData]"
        let AllocArray = []
        let AllocTemp = [];
        let Alloc;
        let Temp;
        let LineSeq;

        await db.INV_StockAlloc.destroy({ where: { TransNo: TransNo } })

        let sqlData = `SELECT 
                        S.HeaderNo, S.LocationCode, S.ItemCode, S.Location, S.Item, S.ItemTrackBy, S.BatchNo, Quantity, UnitPrice, AvgCost, ExpiryDate,
                        QtyAlloc=SUM(ISNULL(A.QtyOut,0)),
                        QtyOut=SUM(ISNULL(D.QtyOut,0)),
                        QtyBal=Quantity - (SUM(ISNULL(A.QtyOut,0)) + SUM(ISNULL(D.QtyOut,0)))
                        FROM INV_StockMaster S
                        LEFT OUTER JOIN (SELECT HeaderNo, QtyOut = SUM(QtyOut) FROM INV_StockAlloc GROUP BY HeaderNo) AS A ON S.HeaderNo = A.HeaderNo
                        LEFT OUTER JOIN (SELECT HeaderNo, QtyOut = SUM(QtyOut) FROM INV_StockDetail GROUP BY HeaderNo) AS D ON S.HeaderNo = D.HeaderNo
                        INNER JOIN (SELECT ItemCode, UOMCode, UOM, TaxScheduleCode, UnitQuantity FROM INV_Item) I ON I.ItemCode = S.ItemCode 
                        WHERE LocationCode = :LocationCode
                        GROUP BY S.HeaderNo, S.LocationCode, S.ItemCode, S.Location, S.Item, S.ItemTrackBy, S.BatchNo,
                        Quantity, UnitPrice, AvgCost, ExpiryDate
                        HAVING Quantity > (SUM(ISNULL(A.QtyOut,0)) + SUM(ISNULL(D.QtyOut,0)))`

        let StockData = await db.sequelize.query(sqlData, {
            replacements: { LocationCode: LocationCode },
            type: db.Sequelize.QueryTypes.SELECT,
        });

        StockData = JSON.stringify(StockData);
        StockData = JSON.parse(StockData);

        DetailData = JSON.stringify(DetailData)
        DetailData = JSON.parse(DetailData)

        await Promise.all(
            DetailData.map(function (val) {
                console.log({val})
                LineSeq = val.TLineSeq ? val.TLineSeq : val.DLineSeq
                let QtyReq = 0
                let QtyFul = 0
                let QtyLine = 0

                if (val.ItemType === 'Inventoried Item') {
                    QtyReq = val.BaseQuantity;

                    let ItemStock = StockData.filter(i => i.ItemCode === val.ItemCode)
                    if (ItemStock.length > 0) {

                        for (let itm of ItemStock) {

                            if (QtyFul >= QtyReq) {
                                break;
                            }

                            if (itm.QtyBal > (QtyReq - QtyFul)) {
                                QtyLine = QtyReq - QtyFul
                            }
                            else {
                                QtyLine = itm.QtyBal
                            }

                            QtyFul = QtyFul + QtyLine

                            Alloc = {
                                RID: 0,
                                RecordDate: new Date(),
                                HeaderNo: itm.HeaderNo,
                                LocationCode: itm.LocationCode,
                                Location: itm.Location,
                                ItemCode: itm.ItemCode,
                                Item: itm.Item,
                                BatchNo: '',
                                TransType: TransType,
                                ItemTrackBy: itm.ItemTrackBy,
                                TransNo: TransNo,
                                TransDate: TransDate,
                                QtyOut: QtyLine,
                                UnitCost: itm.UnitPrice,
                                LineNo: LineSeq
                            }
                            AllocArray.push(Alloc)
                        }

                        if (QtyFul < QtyReq) {
                            Temp = {
                                HeaderNo: 0,
                                LocationCode: val.LocationCode,
                                ItemCode: val.ItemCode,
                                BatchNo: '',
                                TransType: TransType,
                                TransNo: TransNo,
                                TransDate: TransDate,
                                QtyOut: val.QtyOut,
                                QtyFail: QtyFul,
                                LineNo: LineSeq,
                                Status: 'Fail'
                            }

                            AllocTemp.push(Temp)
                        }
                    }
                    else {
                        Temp = {
                            HeaderNo: 0,
                            LocationCode: LocationCode,
                            ItemCode: val.ItemCode,
                            BatchNo: '',
                            TransType: TransType,
                            TransNo: TransNo,
                            TransDate: TransDate,
                            QtyOut: val.BaseQuantity,
                            QtyFail: val.BaseQuantity,
                            LineNo: LineSeq,
                            Status: 'Fail'
                        }

                        AllocTemp.push(Temp)
                    }
                }
            })
        );




        let FailTemp = AllocTemp.filter(a => a.Status === 'Fail')
        let FailCount = FailTemp.length

        console.log({ FailCount, AllocArray, AllocTemp, FailTemp })
        if (FailCount > 0) {
            await db.INV_StockAlloc.destroy({
                where: {
                    TransNo: TransNo
                },
                // transaction: t
            })
            let resp = {
                TransNo: TransNo,
                columns: [
                    {
                        title: "Item Code",
                        field: "ItemCode",
                        headerStyle: {
                            border: "1px solid #ccc8c8",
                            fontWeight: "bolder",
                            background: "#e3dede",
                            paddingTop: 1,
                            paddingBottom: 1,
                            width: "35%",
                        },
                        cellStyle: {
                            border: "1px solid #ccc8c8",
                            paddingTop: 1,
                            paddingBottom: 1,
                            width: "35%",
                        },
                    },
                    {
                        title: "Filed Qty",
                        field: "QtyFail",
                        headerStyle: {
                            border: "1px solid #ccc8c8",
                            fontWeight: "bolder",
                            background: "#e3dede",
                            paddingTop: 1,
                            paddingBottom: 1,
                            width: "35%",
                        },
                        cellStyle: {
                            border: "1px solid #ccc8c8",
                            paddingTop: 1,
                            paddingBottom: 1,
                            width: "35%",
                        },
                    },
                    {
                        title: "Status",
                        field: "Status",
                        headerStyle: {
                            border: "1px solid #ccc8c8",
                            fontWeight: "bolder",
                            background: "#e3dede",
                            paddingTop: 1,
                            paddingBottom: 1,
                            width: "35%",
                        },
                        cellStyle: {
                            border: "1px solid #ccc8c8",
                            paddingTop: 1,
                            paddingBottom: 1,
                            width: "35%",
                        },
                    },
                ],
                rows: FailTemp,
            };
            return { Success: false, Message: "Allocation Process RollBacked!", data: resp }
        }
        else {
            // console.log({PostedData,AllocArray})
            // if (PostedData) {
                // await db.INV_StockDetail.bulkCreate(AllocArray)
                // return { Success: true, Message: "Consumption Process Completed!", data: [] }
            // }
            // else {
                await db.INV_StockAlloc.bulkCreate(AllocArray)
                return { Success: true, Message: "Allocation Process Completed!", data: [] }
            // }
        }
    }
    catch (ex) {
        console.log(ex)
        return { Success: false, Message: "Allocation Process RollBacked!", data: [] }
    }
};