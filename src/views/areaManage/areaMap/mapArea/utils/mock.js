const areaList1 = [
  {
    id: '21',
    name: '珠江新城片区',
    setting: {
      polygon: {
      strokeColor: '#f69f2e',
      strokeOpacity: 1,
      strokeWeight: 2,
      strokeStyle: 'solid',
      titleFontSize: 20,
      titleColor: '#000000',
      fillColor: '#f69f2e',
      fillOpacity: 0.3,
        path: [
          [
            113.31103,
            23.124525
          ],
          [
            113.363543,
            23.127127
          ],
          [
            113.349158,
            23.100741
          ],
          [
            113.303365,
            23.106557
          ]
        ]
      },
      marker: {
        fillColor: '#ff0000',
        list: [
          { id: '211', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.321218, 23.119886] },
          { id: '212', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.324834, 23.119783] },
          { id: '213', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.332821, 23.118778] }
        ]
      }
    }
  },
  {
    id: '22',
    name: '岗顶片区',
    setting: {
      polygon: {
        strokeColor: '#f69f2e',
        strokeOpacity: 1,
        strokeWeight: 2,
        strokeStyle: 'solid',
        titleFontSize: 20,
        titleColor: '#000000',
        fillColor: '#f69f2e',
        fillOpacity: 0.3,
        path: [
          [
            113.32278,
            23.142534
          ],
          [
            113.362455,
            23.142867
          ],
          [
            113.350197,
            23.12826
          ],
          [
            113.317631,
            23.127794
          ],
          [
            113.312191,
            23.137131
          ]
        ]
      },
      marker: {
        fillColor: '#ff0000',
        list: [
          { id: '221', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.336962, 23.136122] },
          { id: '222', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.339846, 23.134994] },
          { id: '223', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.337433, 23.134203] }
        ]
      }
    }
  },
  {
    id: '23',
    name: '体育中心片区',
    setting: {
      polygon: {},
      marker: {
        fillColor: '#ff0000',
        list: [
          { id: '231', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.321547, 23.137971] },
          { id: '232', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.321471, 23.133609] },
          { id: '233', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.321547, 23.131567] },
          { id: '234', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.324499, 23.133748] }
        ]
      }
    }
  },
  {
    id: '24',
    name: '华师片区',
    setting: {
      polygon: {},
      marker: {
        fillColor: '#ff0000',
        list: [
          { id: '241', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.340387, 23.141457] },
          { id: '241', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.341803, 23.141501] },
          { id: '241', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.345398, 23.140477] }
        ]
      }
    }
  },
  {
    id: '25',
    name: '龙洞片区',
    setting: {
      polygon: {},
      marker: {
        fillColor: '#ff0000',
        list: [
          { id: '251', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.364815, 23.19664] },
          { id: '251', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.364731, 23.198753] },
          { id: '251', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.369748, 23.196151] }
        ]
      }
    }
  }
]
const areaList2 = [
  {
    id: '11',
    name: '嘉禾片区',
    setting: {
      polygon: {},
      marker: {
        fillColor: '#ff0000',
        list: [
          { id: '111', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.289712, 23.238176] },
          { id: '112', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.286508, 23.239681] },
          { id: '113', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.29555, 23.240924] },
          { id: '114', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.292702, 23.23641] }
        ]
      }
    }
  },
  {
    id: '12',
    name: '新市片区',
    setting: {
      polygon: {},
      marker: {
        fillColor: '#ff0000',
        list: [
          { id: '121', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.25948, 23.194983] },
          { id: '122', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.261731, 23.195093] },
          { id: '123', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.261821, 23.193907] }
        ]
      }
    }
  },
  {
    id: '13',
    name: '金沙洲片区',
    setting: {
      polygon: {},
      marker: {
        fillColor: '#ff0000',
        list: [
          { id: '131', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.20857, 23.153785] },
          { id: '132', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.205692, 23.156777] },
          { id: '133', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.210134, 23.150736] }
        ]
      }
    }
  },
  {
    id: '14',
    name: '钟落潭片区',
    setting: {
      polygon: {},
      marker: {
        fillColor: '#ff0000',
        list: [
          { id: '141', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.401515, 23.375047] },
          { id: '142', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.400556, 23.377646] },
          { id: '143', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.39946, 23.375592] },
          { id: '144', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.401835, 23.374125] }
        ]
      }
    }
  }
]
const areaList3 = [
  {
    id: '31',
    name: '江南西片区',
    setting: {
      polygon: {},
      marker: {
        fillColor: '#ff0000',
        list: [
          { id: '311', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.273812, 23.097615] },
          { id: '312', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.27408, 23.09692] },
          { id: '313', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.273804, 23.097189] }]
      }
    }
  },
  {
    id: '32',
    name: '北京路片区',
    setting: {
      polygon: {},
      marker: {
        fillColor: '#ff0000',
        list: [
          { id: '321', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.270969, 23.119367] },
          { id: '322', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.270492, 23.119111] },
          { id: '323', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.26995, 23.118734] }
        ]
      }
    }
  },
  {
    id: '33',
    name: '海珠广场片区',
    setting: {
      polygon: {},
      marker: {
        fillColor: '#ff0000',
        list: [
          { id: '331', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.263815, 23.114582] },
          { id: '332', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.264649, 23.114865] }]
      }
    }
  },
  {
    id: '34',
    name: '西门口片区',
    setting: {
      polygon: {},
      marker: {
        fillColor: '#ff0000',
        list: [
          { id: '341', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.255948, 23.126931] },
          { id: '342', info: { 地址: 'xxx', xxx: 'xxx' }, path: [113.255884, 23.123817] }
        ]
      }
    }
  }
]
const companyList = [
  { id: '1', name: '天河分公司', areaList: areaList1 },
  { id: '2', name: '白云分公司', areaList: areaList2 },
  { id: '3', name: '越秀分公司', areaList: areaList3 }
]

export default companyList
