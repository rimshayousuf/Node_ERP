const { response } = require("express");
const MaterialData = require("./MaterialData");
const GetNextNo = require('./GenerateNextNo');
const { TableHints } = require('sequelize');


let item;

exports.updateOrCreate = async (model, where, newItem) => {
  try {
    let foundItem = await model.findOne(where);

    foundItem = JSON.stringify(foundItem);
    foundItem = JSON.parse(foundItem);
    if (!foundItem) {
      item = await model.create(newItem);
      return { Data: item, success: true, created: true };
    }
    else {
      item = await model.update(newItem, where);
      return { Data: foundItem, success: true, created: false };
    }
  } catch (err) {
    console.log(err)
    return { Data: {}, success: false, created: false };
  }
};

exports.Trans_updateOrCreate = async (db, model, model_NN, where, newItem, t) => {
  try {

    let foundItem = await model.findOne(where);
    foundItem = JSON.stringify(foundItem);
    foundItem = JSON.parse(foundItem);

    console.log({ foundItem })

    if (!foundItem) {
      let TransNo = await GetNextNo.NextNo(model_NN, newItem.TransType, t);
      newItem.TransNo = TransNo;
      item = await model.create(newItem, { transaction: t });
      return { Data: item, success: true, created: true };
    }
    else {
      item = await model.update(newItem, where);
      return { Data: foundItem, success: true, created: false };
    }
  } catch (err) {
    console.log(err)
    return { Data: {}, success: false, created: false };
  }
};

exports.Trans2_updateOrCreate = async (model, data, where, t) => {
  try {

    let foundItem = await model.findOne(where);
    foundItem = JSON.stringify(foundItem);
    foundItem = JSON.parse(foundItem);


    if (!foundItem) {
      item = await model.create(data, t);
      return { Data: item, success: true, created: true };
    }
    else {
      item = await model.update(data, where, t);
      return { Data: foundItem, success: true, created: false };
    }
  } catch (err) {
    console.log(err)
    return { Data: {}, success: false, created: false };
  }
};

exports.bulkCreate = async (model, data, t) => {
  try {
    item = await model.bulkCreate(data,{tableHint: TableHints.NOLOCK});
    return { Data: item, success: true };
  } catch (err) {
    console.log({err:err})
    return { Data: {}, success: false };
  }
};

exports.Delete = async (model, where) => {
  try {
      await model.destroy(where);
      return { Data: {}, success: true };
  } catch (err) {
    return { Data: {}, created: false };
  }
};

exports.getAll = async (model, where, mt, columns) => {
  try {
    let foundItem = await model.findAll(where, { attributes: columns}, {order: [["createdAt", 'DESC']] });
    foundItem = JSON.stringify(foundItem);
    foundItem = JSON.parse(foundItem);

    if (mt) {
      let RegData = await MaterialData.Register(foundItem, columns);
      return { Data: RegData, success: true };
    } else {
      return { Data: foundItem, success: true };
    }
  } catch (err) {
    console.log(err)
    return { Data: [], success: false };
  }
};

exports.getTreeAll = async (model, where, mt, columns, page, size) => {
  try {
    const { limit, offset } = getPagination(page, size);
    let foundItem = await model.findAll(where, { limit, offset, attributes: columns, order: '"createdAt" DESC' });
    foundItem = JSON.stringify(foundItem);
    foundItem = JSON.parse(foundItem);

    if (mt) {
      let RegData = await MaterialData.TreeRegister(foundItem, columns);
      return { Data: RegData, success: true };
    } else {
      return { Data: foundItem, success: true };
    }
  } catch (err) {
    console.log(err)
    return { Data: [], success: false };
  }
};

exports.LookUp = async (model, where, mt, columns) => {
  try {
    let foundItem = await model.findAll(where);
    foundItem = JSON.stringify(foundItem);
    foundItem = JSON.parse(foundItem);

    if (mt) {
      let RegData = await MaterialData.LookUp(foundItem, columns);
      return { Data: RegData, success: true };
    } else {
      return { Data: foundItem, success: true };
    }
  } catch (err) {
    console.log(err)
    return { Data: [], success: false };
  }
};

exports.getOne = async (model, where) => {
  try {

    let foundItem = await model.findOne(where);
    foundItem = JSON.stringify(foundItem);
    foundItem = JSON.parse(foundItem);
    return { Data: foundItem ? foundItem : {}, success: foundItem ? true : false };
  } catch (err) {
    console.log(err)
    return { Data: {}, success: false };
  }
};

exports.Trans_bulkCreate = async (model, where, data, t) => {
  try {
    
    console.log({data})

    await model.destroy(where, { transaction: t });
    console.log("Completed!")
    item = await model.bulkCreate(data, { transaction: t });
    console.log({item})
    return { Data: item, success: true };

  } catch (err) {
    console.log(err)
    return { Data: {}, success: false };
  }
};


const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};