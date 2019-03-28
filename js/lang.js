﻿﻿const txt_lang = {
    'zh-cn': {
        title: '海南省遥感灾情辅助决策系统',
        title_min: 'Hainan Remote sensing disaster decision support system',

        time_mon: '星期一',
        time_tues: '星期二',
        time_wed: '星期三',
        time_thurs: '星期四',
        time_fri: '星期五',
        time_satur: '星期六',
        time_sun: '星期日',

        menu: '菜单',
        menu_loc: '灾害现场定位',
        menu_typhoon_path: '台风降雨分析',
        menu_house: '房屋损毁检测',
        menu_road: '道路损毁检测',
        menu_load: '灾害数据载入',
        menu_extra: '洪涝灾情评估',
        menu_assess: '洪涝灾情评估',
        menu_report: '评估决策报告',
        menu_pre_typh_data:'预测台风路径图',
        menu_pos_typh_data:'实际台风路径图',
        menu_rain: '降雨分布图',
        menu_pre_house_data: '灾前房屋数据',
        menu_pos_house_data: '灾后房屋数据',
        menu_pre_road: '灾前道路数据',
        menu_pos_road: '灾后道路数据',
        menu_des_road: '道路损毁数据',
        menu_pre_wat_tif:'灾前影像',
        menu_pos_wat_tif:'灾后影像',
        menu_pre_water: '灾前水体提取',
        menu_pos_water: '灾后水体提取',
        menu_flood: '洪涝范围提取',
        menu_flood_ass:'评估报告',

        situation_sat: '卫星概况',
        satellite_gaofen: '高分卫星',
        satellite_ziyuan: '资源卫星',
        satellite_shaobin: '哨兵卫星',
        gaofen1: '高分一号',
        satellite_height: '轨道高度',
        satellite_resolution: '空间分辨率',
        satellite_return: '回归周期',
        satellite_time: '重访时间',

        situation_dis: '灾害概况',
        situation_num: '灾害数量',
        situation_fre: '灾害频次',
        situation_loss: '总经济损失',
        situation_casual: '死亡数',
        situation_vicNum: '总经济损失',
        situation_injNum: '受伤人数',
        situation_missNum: '失踪人数',
        situation_totalNum: '总人数',

        economic: '经济损失',
        economic_dirLoss: '直接损失',
        economic_indLoss: '间接损失',
        economic_totalLoss: '总经济损失',
        economic_farmLoss: '农田经济损失',
        economic_roadLoss: '道路经济损失',
        economic_houseLoss: '房屋经济损失',
        economic_otherLoss: '其他经济损失',
        economic_annLoss: '各年经济损失',

        typhoon: '台风历史数据',

        history_data:'历史数据',



        communication: '通讯设备状态',
        communication_deviceNum: '通讯设备数量',
        communication_smoothrate: '通信设备畅通率',
        communication_major: '主要设备',
        communication_sate: '卫星便携站',
        communication_pos: '定位',
        communication_uav: '无人机',
        communication_mob: '移动终端',
        communication_mesh: 'Mesh',
        communication_name: '设备名',
        communication_speed: '传输速度',
        communication_status: '设备状态',
        communication_data: '数据类型',
        communication_devname1: "卫星1",
        communication_devname2: "卫星2",
        communication_devname3: "卫星3",
        communication_devname4: '卫星4',
        communication_devname5: "无人机1",
        communication_devname6: "无人机2",
        communication_devname7: "无人机3",
        communication_devname8: "无人机4",
        communication_devname9: "终端1",
        communication_devname10: "终端2",
        communication_devname11: "终端3",
        communication_devname12: "终端4",
        communication_class: '类',
        communication_bps1: '16Mbps',
        communication_bps2: '9.6Mbps',
        communication_stable: '稳定',
        communication_stabler: '较稳定',
        communication_compliance: '达标',

        process: '数据处理进度',
        process_num: '已处理数',
        process_tobe: '待处理',
        process_totaldata: '总处理数据',
        process_status: '数据处理状态',
        process_processing: '处理中',
        process_runchat: '数据处理运行图',
        process_progress: '处理进度',
        process_name: '处理名称',
        process_instructions: '处理说明',
        process_time: '处理时长',
        process_namegeo: '几何校正',
        process_namerad: '辐射定标',
        process_namewater: '水体提取',
        process_namevegetation: '植被提取',
        process_namemedian: '中值滤波',
        process_nameedge: '边缘检测',
        process_namefusion: '数据融合',
        process_namechange: '变化检测',
        process_nameintensity: '烈度分析',
        process_namestatistic: '受灾统计',
        process_nameassess: '受灾评估',
        process_nameanalysis: '决策分析',
        process_nametransfer: '数据传输',
        process_detailgeo: '改正和消除影像几何畸变',
        process_detailrad: '将图像转换为绝对辐射亮度',
        process_detailwater: '水体提取',
        process_detaivegetationl: '植被提取',
        process_detailmedian: '中值滤波',
        process_detailedge: '边缘检测',
        process_detailfusion: '数据融合',
        process_detailchange: '水体提取',
        process_detailintensity: '变化检测',
        process_detailstatistic: '受灾统计',
        process_detailassess: '受灾评估',
        process_detailanalysis: '决策分析',
        process_detailtransfer: '数据传输',
        process_normal: '正常',
        process_slow: '缓慢',
        process_blocking: '阻塞',
        process_stop: '停止',

        rescue: '救援指标',
        rescue_short: '物资紧缺',
        rescue_tent: '救生船',
        rescue_need: '急需',
        rescue_quan: '数量',
        rescue_staff: '医护人员',
        rescue_team: '救援人员',
        rescue_volun: '志愿者',
        rescue_equip: '大型设备',
        rescue_water: '饮用水',
        rescue_drug: '药物',
        rescue_exist: '已有量',
        rescue_total: '总量',
        rescue_demand: '需求量',

        distype: '灾害种类分布',
        distype_type: '灾害种类',
        distype_flood: '洪水',
        distype_flow: '泥石流',
        distype_earthquake: '地震',
        distype_drought: '干旱',
        distype_fire: '火灾',
        distype_other: '其他',

        disfrequency: '各年灾害频次',
        Casualties_loss: '灾害损失'


    },
    'en-au': {
        title: 'Disaster information integration',
        title_min: 'Hainan Remote sensing disaster decision support system',

        time_mon: 'Monday',
        time_tues: 'Tuesday',
        time_wed: 'Wednesday',
        time_thurs: 'Thursday',
        time_fri: 'Friday',
        time_satur: 'Saturday',
        time_sun: 'Sunday',

        menu: 'menu',
        menu_loc: 'Disaster location',
        menu_load: 'Data loading',
        menu_extra: 'Flood extraction',
        menu_assess: 'Flood assessment',
        menu_report: 'Decision report',
        menu_predata: 'Pre data',
        menu_posdata: 'Post data',
        menu_prewatar: 'Pre water data',
        menu_poswater: 'Water data',
        menu_flood: 'Flood',

        situation: 'General situation',
        situation_num: 'number',
        situation_fre: 'frequency',
        situation_loss: 'economic loss',
        situation_casual: 'casualty',
        situation_vicNum: 'victims',
        situation_injNum: 'injured',
        situation_missNum: 'missing',
        situation_totalNum: 'total number',

        economic: 'Economic loss',
        economic_dirLoss: 'direct loss',
        economic_indLoss: 'indirect loss',
        economic_totalLoss: 'total loss',
        economic_farmLoss: 'Agricultural economic loss',
        economic_roadLoss: 'Road economic loss',
        economic_houseLoss: 'Honey economic loss',
        economic_otherLoss: 'Other economic losses',
        economic_annLoss: 'Economic loss per year',

        history_data:'Historical data',

        communication: 'Communication equipment status',
        communication_deviceNum: 'communication devices',
        communication_smoothrate: 'smooth rate',
        communication_major: 'Major equipment',
        communication_sate: 'satellite portable station',
        communication_pos: 'Positioning',
        communication_uav: 'UAV',
        communication_mob: 'mobile terminal',
        communication_mesh: 'Mesh',
        communication_name: 'device name',
        communication_speed: 'transfer speed',
        communication_status: 'device status',
        communication_data: 'data type',
        communication_devname1: "Satellite 1",
        communication_devname2: "Satellite 2",
        communication_devname3: "Satellite 3",
        communication_devname4: 'satellite 4',
        communication_devname5: "Drone 1",
        communication_devname6: "Drone 2",
        communication_devname7: "Drone 3",
        communication_devname8: "Drone 4",
        communication_devname9: "Terminal 1",
        communication_devname10: "Terminal 2",
        communication_devname11: "Terminal 3",
        communication_devname12: "Terminal 4",
        communication_class: ' class',
        communication_bps1: '16Mbps',
        communication_bps2: '9.6Mbps',
        communication_stable: 'stable',
        communication_stabler: 'Stabler',
        communication_compliance: 'standard',

        process: 'Data processing progress',
        process_num: 'Processed number',
        process_tobe: 'To be processed',
        process_totaldata: 'Total processing data',
        process_status: 'Data processing status',
        process_processing: 'Processing',
        process_runchat: 'Data processing run chart',
        process_progress: 'progress',
        process_name: 'name',
        process_instructions: 'instructions',
        process_time: 'time',
        process_namegeo: 'Geometry correction',
        process_namerad: 'radiation calibration',
        process_namewater: 'Water extraction',
        process_namevegetation: 'vegetation extraction',
        process_namemedian: 'median filtering',
        process_nameedge: 'Edge detection',
        process_namefusion: 'Data Fusion',
        process_namechange: 'change detection',
        process_nameintensity: 'Intensity analysis',
        process_namestatistic: 'Disaster Statistics',
        process_nameassess: 'Disaster assessment',
        process_nameanalysis: 'Decision Analysis',
        process_nametransfer: 'Data Transfer',
        process_detailgeo: 'Correct and eliminate image geometric distortion',
        process_detailrad: 'Convert the image to absolute radiance',
        process_detailwater: 'Water extraction',
        process_detaivegetationl: 'Vegetation extraction',
        process_detailmedian: 'median filtering',
        process_detailedge: 'Edge detection',
        process_detailfusion: 'Data Fusion',
        process_detailchange: 'change detection',
        process_detailintensity: 'Intensity analysis',
        process_detailstatistic: 'Disaster Statistics',
        process_detailassess: 'Disaster assessment',
        process_detailanalysis: 'Decision Analysis',
        process_detailtransfer: 'Data Transfer',
        process_normal: 'normal',
        process_slow: 'slow',
        process_blocking: 'blocking',
        process_stop: 'stop',

        rescue: 'Rescue indicator',
        rescue_short: 'Material shortage',
        rescue_tent: 'tent',
        rescue_need: 'needed',
        rescue_quan: 'quantity',
        rescue_staff: 'health staff',
        rescue_team: 'rescue team',
        rescue_volun: 'Volunteer',
        rescue_equip: 'large equipment',
        rescue_water: 'Drinking water',
        rescue_drug: 'drug',
        rescue_exist: 'existing quantity',
        rescue_total: 'total',
        rescue_demand: 'demand quantity',

        distype: 'Distribution of disaster types',
        distype_type: 'Disaster type',
        distype_flood: 'Flood',
        distype_flow: 'Debris flow',
        distype_earthquake: 'Earthquake',
        distype_drought: 'drought',
        distype_fire: 'Fire',
        distype_other: 'other',

        disfrequency: 'Frequency of disasters'
    }
};