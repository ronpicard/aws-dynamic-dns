'use strict';

// acquire aws api instance
const aws = require('aws-sdk');

aws.config = new aws.Config();
aws.config.accessKeyId = "";
aws.config.secretAccessKey = "";

const shell = require('child_process').spawnSync;

const route = new aws.Route53();

// get AWS hosted zone id
const getHostedZoneDomainId = () => {
  return new Promise((resolve, reject) => {
    route.listHostedZones({}, (err, data) => {
      if (!err) {
        const id = data.HostedZones
          .filter(x => x.Name === (process.env.DOMAIN + '.'))
          .map(x => x.Id)[0]
          .split('/')[2];
        resolve(id);
      } else {
        reject(err);
      }
    });
  });
};

// get current records from zone
const getCurrentRecordSets = id => {
  return new Promise((resolve, reject) => {
    route.listResourceRecordSets({ HostedZoneId: id }, (err, data) => {
      if (!err) {
        const resourceRecordSets = data.ResourceRecordSets.filter(x => x.TTL === 300);
        resolve(resourceRecordSets)
      } else {
        reject(err);
      }
    });
  });
};

// get current home public ip
const getCurrentHomeIp = () => {
  const ip = shell('dig', [
    '+short',
    'myip.opendns.com',
    '@resolver1.opendns.com',
  ]);
  return ip.stdout.toString();
};

// update DNS
const updateDNS = (id, ip) => {
  const params1 = {
    ChangeBatch: {
      Changes: [
        {
          Action: 'UPSERT',
          ResourceRecordSet: {
            Name: process.env.DOMAIN,
            Type: 'A',
            ResourceRecords: [
              {
                Value: ip,
              },
            ],
            TTL: 300,
          },
        },
      ],
    },
    HostedZoneId: id,
  };
  const params2 = {
    ChangeBatch: {
      Changes: [
        {
          Action: 'UPSERT',
          ResourceRecordSet: {
            Name: 'www.' + process.env.DOMAIN,
            Type: 'A',
            ResourceRecords: [
              {
                Value: ip,
              },
            ],
            TTL: 300,
          },
        },
      ],
    },
    HostedZoneId: id,
  };
  route.changeResourceRecordSets(params1, (err, data) => {
    if (!err) {
      console.log(data);
    } else {
      console.error(err);
    }
  });
  route.changeResourceRecordSets(params2, (err, data) => {
    if (!err) {
      console.log(data);
    } else {
      console.error(err);
    }
  });
};

// loop functions
function repeat() {
  getHostedZoneDomainId().then(id => {
    const digIp = getCurrentHomeIp();
    getCurrentRecordSets(id).then(resourceRecordSets => {
      resourceRecordSets.forEach(x => {
        console.log('DNSIP: ' + x.ResourceRecords[0].Value.trim())
        console.log('CurrentIP: ' + x.ResourceRecords[0].Value.trim());
        if (x.ResourceRecords[0].Value.trim() !== digIp.trim()) {
          updateDNS(id, digIp);
        }
      });
    });
  });
  
  // repeat time in seconds
  var repeateTimeInSeconds = 30
  var repeateTimeInMilliSeconds = repeateTimeInSeconds*1000

  setTimeout(repeat, repeateTimeInMilliSeconds);
}

repeat();

