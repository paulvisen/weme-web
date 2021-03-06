$(document).ready(function() {
	var jumboHeight = $('.jumbotron').outerHeight();
	function parallax(){
	    var scrolled = $(window).scrollTop();
	    $('.bg').css('height', (jumboHeight-scrolled) + 'px');
	}

	$(window).scroll(function(e){
	    parallax();
	});
	
	var ViewModel1 = function() {
		var self = this;
		self.isEdu = ko.observable(false);
		self.token = getCookie("token");
		self.currentProfile = ko.observable();
		self.avaliableSex = ko.observableArray(['男','女']);
		self.chosenSex = ko.observableArray();
		self.avaliableSchool = ko.observableArray([
												'东南大学',
												'南京师范大学',
												'中国药科大学',
												'南京林业大学',
												'南京大学',
												'南京林业大学'
												]);
		self.chosenSchool = ko.observableArray();
		self.avaliableDegree = ko.observableArray([
													'本科',
													'硕士',
													'博士'
												]);
		self.chosenDegree = ko.observableArray();
		self.selectedPicture = ko.observable();

		self.previewFile = function(){
		  var preview = document.querySelector('img#preview');
		  var file    = document.querySelector('input[type=file]').files[0];
		  var reader  = new FileReader();

		  reader.onloadend = function () {
		    preview.src = reader.result;
		    self.selectedPicture(reader.result);
		  };

		  if (file) {
		  	preview.hidden = false;
		    reader.readAsDataURL(file);
		  } else {
		    // preview.src = "";
		    preview.hidden = true;
		  }
		};	

		self.submitPicture = function() {
			var formData = new FormData();
			formData.append('avatar', document.querySelector('input[type=file]').files[0]);
			var jsonStr =  '{"token":'+'"'+self.token+'"'+',"type":"0","number":"0"}';
			console.log(jsonStr);
			// formData.append('json', jsonStr);
			console.log("into it");
			 //console.log(self.selectedPicture());
			$.ajax({
					  type: "POST",
					  url: "/api-multipart/uploadavatar",
					  dataType: "json",
					  contentType: false,
					  processData: false,
					  headers:{'json':jsonStr},//send json through headers!Important
					  data:formData
					})
			.done(function(json) {
				       if (json["state"]!=="successful") {
				       		// self.writeList(data);
				       		// console.dir(json);
				       		console.log(json);
				       		alert("上传头像失败");
				       		// self.getProfileByToken();
				       		return;
				       } 
				       else{
				       		//console.dir("got data!");
				       		// self.writeList(data);
				       		alert("上传头像成功");
				       		location.reload();//刷新页面
							return;
				       }
					})
			.fail(function(e) {
					       //console.log(e);
	                		return;

					});
		};

		self.submitChange = function() {
			var data = {
					  	"token": self.token,
						"birthday":self.currentProfile().birthday(),
						"degree":self.currentProfile().degree(),
						"department":self.currentProfile().department(),
						"enrollment":self.currentProfile().enrollment(),
						"gender":self.currentProfile().gender(),
						"hobby":self.currentProfile().hobby(),
						"hometown":self.currentProfile().hometown(),
						"name":self.currentProfile().name(),
						"phone":self.currentProfile().phone(),
						"preference":self.currentProfile().preference(),
						"qq":self.currentProfile().qq(),
						"school":self.selectedSchool(),
						"username":self.currentProfile().username(),
						"wechat":self.currentProfile().wechat()
					  };
			//console.log(data);
			$.ajax({
					  type: "POST",
					  url: "/api/post/editprofileinfo",
					  dataType: "json",
					  data:data
					})
			.done(function(json) {
				       if (json["state"]!=="successful") {
				       		// self.writeList(data);
				       		//console.dir(json);
				       		//console.log(json);
				       		alert("信息修改失败");
				       		self.getProfileByToken();
				       		return;
				       } 
				       else{
				       		//console.dir("got data!");
				       		// self.writeList(data);
				       		//console.log(self.currentProfile());
				       		alert("信息修改成功");
				       		self.getProfileByToken();
							return;
				       }
					})
			.fail(function(e) {
					       //console.log(e);
	                		return;

					});
		};

		self.getProfileByToken = function()  {
			////console.log("正在获取个人信息!");
			self.currentProfile("");
			$.ajax({
					  type: "POST",
					  url: "/api/post/getprofile",
					  dataType: "json",
					  data:{
					  	"token": self.token
					  }
					})
			.done(function(json) {
				       if (json["state"]!=="successful") {
				       		// self.writeList(data);
				       		//console.dir(json);
				       		return;
				       } 
				       else{
				       		//console.dir("got data!");
				       		// self.writeList(data);
				       		// console.dir(json);
				       		self.currentProfile(new Profile(json));
							return;
				       }
					})
			.fail(function(e) {
					       //console.log(e);
	                		return;

					});
		};

		self.getProfileByToken();
  
        self.arrayProvince = ko.observableArray(UniversityObj.province);
        self.selectedProvince = ko.observable();
        self.arrayBindUniviersity = ko.observableArray();
        self.myChangeProvince = function() {
        	self.arrayBindUniviersity.removeAll();
        	var ProvinceUni = UniversityObj.all[self.selectedProvince()['id']]['university'];
        	 //console.log(ProvinceUni);
        	ProvinceUni.forEach(function(university) {
        		self.arrayBindUniviersity.push(university);
        	});
        };
        // self.myChangeSchool = function() {
        // 	//console.log(self.selectedSchool());
        // };
        self.selectedSchool = ko.observable();

	};

	var masterVM = (function() {
		var self = this;
		self.ViewModel1 = new ViewModel1();//userProfile
	})();

	ko.applyBindings(masterVM);
});