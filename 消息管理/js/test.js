let json = `{
	"status": {
		"code": 0,
		"msg": "成功"
	},
	"data": {
		"page": 1,
		"pre_page": 20,
		"list": [{
				"id": "1",
				"app_id": "5",
				"theme": "您收到一张优惠卷",
				"info": "亲爱的XXX：你好， 你的预报名申请已经通过， 请尽快填写确认信息表确认您的信息 ",
				"type_code": "101",
				"is_read": "0",
				"app_name": "会议系统",
				"type_name": "预报名"
			},
			{
				"id": "2",
				"app_id": "5",
				"theme": "您收到一张优惠卷",
				"info": "亲爱的XXX：你好， 你的预报名申请已经通过， 请尽快填写确认信息表确认您的信息 ",
				"type_code": "102",
				"is_read": "0",
				"app_name": "会议系统",
				"type_name": "审核预报名"
			},
			{
				"id": "3",
				"app_id": "5",
				"theme": "您收到一张优惠卷",
				"info": "亲爱的XXX：你好， 你的预报名申请已经通过， 请尽快填写确认信息表确认您的信息 ",
				"type_code": "103",
				"is_read": "0",
				"app_name": "会议系统",
				"type_name": "确定人员信息"
			},
			{
				"id": "4",
				"app_id": "5",
				"theme": "您收到一张优惠卷",
				"info": "亲爱的XXX：你好， 你的预报名申请已经通过， 请尽快填写确认信息表确认您的信息 ",
				"type_code": "104",
				"is_read": "0",
				"app_name": "会议系统",
				"type_name": "上传凭证"
			},
			{
				"id": "5",
				"app_id": "5",
				"theme": "您收到一张优惠卷",
				"info": "亲爱的XXX：你好， 你的预报名申请已经通过， 请尽快填写确认信息表确认您的信息 ",
				"type_code": "105",
				"is_read": "0",
				"app_name": "会议系统",
				"type_name": "审核凭证"
			},
			{
				"id": "6",
				"app_id": "5",
				"theme": "您收到一张优惠卷",
				"info": "亲爱的XXX：你好， 你的预报名申请已经通过， 请尽快填写确认信息表确认您的信息 ",
				"type_code": "101",
				"is_read": "0",
				"app_name": "会议系统",
				"type_name": "预报名"
			},
			{
				"id": "7",
				"app_id": "5",
				"theme": "您收到一张优惠卷",
				"info": "亲爱的XXX：你好， 你的预报名申请已经通过， 请尽快填写确认信息表确认您的信息 ",
				"type_code": "102",
				"is_read": "0",
				"app_name": "会议系统",
				"type_name": "审核预报名"
			},
			{
				"id": "8",
				"app_id": "5",
				"theme": "您收到一张优惠卷",
				"info": "亲爱的XXX：你好， 你的预报名申请已经通过， 请尽快填写确认信息表确认您的信息 ",
				"type_code": "103",
				"is_read": "0",
				"app_name": "会议系统",
				"type_name": "确定人员信息"
			},
			{
				"id": "9",
				"app_id": "5",
				"theme": "您收到一张优惠卷",
				"info": "亲爱的XXX：你好， 你的预报名申请已经通过， 请尽快填写确认信息表确认您的信息 ",
				"type_code": "104",
				"is_read": "0",
				"app_name": "会议系统",
				"type_name": "上传凭证"
			},
			{
				"id": "10",
				"app_id": "5",
				"theme": "您收到一张优惠卷",
				"info": "亲爱的XXX：你好， 你的预报名申请已经通过， 请尽快填写确认信息表确认您的信息 ",
				"type_code": "105",
				"is_read": "0",
				"app_name": "会议系统",
				"type_name": "审核凭证"
			},
			{
				"id": "11",
				"app_id": "5",
				"theme": "您收到一张优惠卷",
				"info": "亲爱的XXX：你好， 你的预报名申请已经通过， 请尽快填写确认信息表确认您的信息 ",
				"type_code": "101",
				"is_read": "0",
				"app_name": "会议系统",
				"type_name": "预报名"
			},
			{
				"id": "12",
				"app_id": "5",
				"theme": "您收到一张优惠卷",
				"info": "亲爱的XXX：你好， 你的预报名申请已经通过， 请尽快填写确认信息表确认您的信息 ",
				"type_code": "102",
				"is_read": "0",
				"app_name": "会议系统",
				"type_name": "优惠券"
			}
		],
		"total": "12",
		"total_page": 30
	}
}`;

let status = JSON.parse(json);
console.log(status)