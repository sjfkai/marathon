'use strict';

const Sequelize = require('sequelize');

const sequelize = new Sequelize('marathon', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  logging: null,
});

const Original = sequelize.define('original', {
  host: {
    type: Sequelize.STRING
  },
  url: {
    type: Sequelize.STRING(1000)
  },
  reponseTime: {
    type: Sequelize.FLOAT
  },
  userAgent: {
    type: Sequelize.STRING(2000)
  },
  ip: {
    type: Sequelize.STRING
  },
  time: {
    type: Sequelize.DATE
  }
}, {
  timestamps: false,
  underscored: true,
  tableName: 'original',
});

const Analyzed = sequelize.define('analyzed', {
  host: {
    type: Sequelize.STRING
  },
  hostName: {
    type: Sequelize.STRING(10),
  },
  url: {
    type: Sequelize.STRING(1000)
  },
  method: {
    type: Sequelize.STRING(10),
  },
  path: {
    type: Sequelize.STRING(1000)
  },
  query: {
    type: Sequelize.STRING(1000)    
  },
  search: {
    type: Sequelize.STRING
  },
  reponseTime: {
    type: Sequelize.FLOAT
  },
  userAgent: {
    type: Sequelize.STRING(2000)
  },
  browserName: {
    type: Sequelize.STRING(30)
  },
  browserVersion: {
    type: Sequelize.STRING(30)
  },
  deviceType: {
    type: Sequelize.STRING(30)
  },
  deviceVendor: {
    type: Sequelize.STRING(30)    
  },
  deviceModel: {
    type: Sequelize.STRING(30)    
  },
  osName: {
    type: Sequelize.STRING(30)    
  },
  osVersion: {
    type: Sequelize.STRING(30)    
  },
  ip: {
    type: Sequelize.STRING
  },
  country: {
    type: Sequelize.STRING(30)
  },
  province: {
    type: Sequelize.STRING(30)
  },
  city: {
    type: Sequelize.STRING(30)
  },
  user: {
    type: Sequelize.STRING(32)
  },
  time: {
    type: Sequelize.DATE
  }
}, {
  timestamps: false,
  underscored: true,
  tableName: 'analyzed',
});


module.exports = sequelize;