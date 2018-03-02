let domain = 'http://account.jspxedu.uqidi.cn/user';


let config = {
	message : domain + '/api/remind_list',
};


let main = "http://account.jspxedu.sydev:8080";

let map = {
	mesNum : main + '/user/api/app_list',
	read : main + "/user/api/read_remind",
	del : main + "/user/api/delete_remind",
}