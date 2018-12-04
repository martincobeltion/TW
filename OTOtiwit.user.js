// ==UserScript==
// @name         OTOtiwit
// @namespace    http://tampermonkey.net/
// @version      0.74
// @description  try to take over the world!
// @author       You
// @match        https://twitter.com/intent/*
// @match        https://twitter.com/*
// @match        http://localhost/*
// @grant        none
// @updateURL    https://github.com/martincobeltion/TW/raw/master/OTOtiwit.user.js
// @require      https://code.jquery.com/jquery-3.3.1.js

// ==/UserScript==

function tarihYap(data){
	var liste= String(data).split(" ");
    var listeSaat=liste[0].split(":");
	var hh = listeSaat[0] < 10 ? '0' + listeSaat[0] : listeSaat[0];
    var mi = listeSaat[1] < 10 ? '0' + listeSaat[1] : listeSaat[1];
	var saat1=hh+":"+mi;

	var yil1 =liste[4];

	var ay1=liste[3];
	var monthNames = ["January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"];
	var aylar = ['Ocak1','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
	var aylarKisa = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
	for(var i=0;i<monthNames.length ;i++)
	{
		if ((monthNames[i]==liste[3])||(aylar[i]==liste[3])||(aylarKisa[i]==liste[3]))
		{ ay1=i;break;}
	}

	ay1=ay1 < 10 ? '0' + ay1 : ay1;
	var gun1 =liste[2] < 10 ? '0' + liste[2] : liste[2];
	return new Date(yil1,ay1,gun1,hh,mi,0,0);
};

function farkHesapla(tarih1,tarih2)
{
	var birgun=24 * 60 * 60*1000;
    var birsaat= 60 * 60*1000;
    var birdakika= 60*1000;
	if((tarih2-tarihYap(tarih1))>birgun*2)
	{//alert(tarih1+" ::::: "+tarihYap(tarih1) +" true"+ (tarih2-tarihYap(tarih1))/(60*60*1000));
        return true;}
	else
	{//alert(" false\n" + tarih1 +" \n "+tarihYap(tarih1) + "\n"+String(tarih2)+ (tarih2-tarihYap(tarih1))/(60*60*1000));
		return false;}
};

function saatKontol(saatStr,periyot)
{
	console.log("11");
	var saat = new Date().getHours();
	var dakika = new Date().getMinutes();
	var temp=[];
	console.log("saatStr.length="+saatStr.length);
	for (var i=0;i<saatStr.length;i++){
		temp=saatStr[i].split(":");
		console.log(temp);
		if (saat==parseInt(temp[0]))
			if (parseInt(temp[1])<=dakika && (parseInt(temp[1])+periyot)>=dakika)
				return true;
	}
	console.log("22");
	return false;
}

function DmKontrol(Kim,kontrolNo)
{
	console.log(kontrolNo+". DmKontrol basliyor ");
	$(".global-dm-nav .Icon--dm").trigger("click");
	var isimListesi = [];
	var msgSay=-1;
	var fullname="";
	var username="";
	var msjIcerik="";
	setTimeout(function()
	{
		var msgSay=$(".is-unread .DMInboxItem-title").length;
		if (msgSay>0)
		{
			var a = [];
			isimListesi = [];
			$(".is-unread").each(function(){
				fullname=$(".fullname",this).html();
				username=$(".username b",this).html();
				msjIcerik=$(".DMInboxItem-snippet",this).html();
				mailAt(Kim,fullname,username,msjIcerik);
			});
			console.log('fullname='+fullname+"&username="+username+"&msjIcerik="+msjIcerik);
			sleep(500);
		}
		else
			console.log("DmKontrol mesaj yok");
		sleep(1000);
		$("#dm_dialog").trigger('click');
	}, 5000);
}

function mailAt(kim,fullname,username,msjIcerik)
{
	console.log(data.join("z:z"));
	var objWindow=window.open('http://localhost/tw1/index.php?kim='+kim+'&fullname='+encodeURIComponent(fullname)+"&username="+username+"&msjIcerik="+encodeURIComponent(msjIcerik), '_blank');
	setTimeout(objWindow.close(),5000);
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}




(function() {
    'use strict';
	console.log("Pro basladi");
	var rgxlocal = /localhost\//;
	if (rgxlocal.test(window.location.href))
    {
		window.location.href="https://twitter.com/";
	}
	else
	{
		try {$(".AdaptiveMedia-threeQuartersWidthPhoto").hide();}
			catch(err) {};
		try {$(".AdaptiveMedia-thirdHeightPhotoContainer").hide();}
			catch(err) {};
		try {$(".AdaptiveMedia-video").hide();}
			catch(err) {};
		try {$(".AdaptiveMedia-container").hide();}
			catch(err) {};
		var profilNo=-1;
		var periyot=34;
		var profiller=[[1,'itsme_emirr',['23:52','21:2','10:16']],
						[2,'RainLins',['17:4','15:56','22:10']],
						[3,'yraitzi',['23:18','16:30','18:46']],
						[4,'AdamHaruka',['14:14','19:54','17:38']],
						[5,'KateElla3',['12:32','9:42','8:0']],
						[6,'AhnesTorin',['13:6','22:44','14:48']],
						[7,'Colinma61697610',['00:26','19:20','8:34']],
						[8,'alisezer353535',['11:24','18:12','9:8']],
						[9,'CalliKoral123',['15:22','11:58','21:36']],
						[10,'kaminski_1231',['10:50','13:40','20:28']]];

		var rgxAnaSayfa = /twitter.com\/?$/;
		var pattIntent = /twitter.com\/intent\/tweet*/;
		try {
			var kullanici=$(".DashUserDropdown-userInfoLink").attr("href");
			kullanici=kullanici.toString().substr(1,kullanici.length);
			var pattProfil= new RegExp("twitter.com/"+kullanici+"\/?","");
			}
		catch(err) {};

		if (pattIntent.test(window.location.href))
		{
			console.log("Paylas");
			document.getElementById("update-form").submit();
			console.log("Paylasildi");
		}
		/*else if (rgxAnaSayfa.test(window.location.href))
		{
			if (!pattProfil.test(window.location.href))
				setTimeout(function(){ window.location.href="https://twitter.com/"+kullanici; }, 5000);
		}*/
		else if (pattProfil.test(window.location.href))
		{
			/*var tarih = document.getElementsByClassName("tweet-timestamp js-permalink js-nav js-tooltip")[0].getAttribute("title");
			var i=0;
			$('.js-actionDelete').each(
				function()
				{
					console.log($(this));
					var zamn=this.parentNode.parentNode.parentNode.parentElement.parentElement.parentElement.getElementsByClassName("tweet-timestamp js-permalink js-nav js-tooltip")[0].getAttribute("title");
					if (farkHesapla(zamn,Date.now()))
					{
						//bekleme kodu ancak bÃÂÃÂ¶yle aÃÂÃÂÃÂÃÂ±lÃÂÃÂ±yor burda
						$(this).delay(5000).queue(function() {$(this).trigger('click');$('.delete-action').trigger('click')});
					}
				});
		}*/


			var sayi=0;
			var msgSay=0;
			var bekleme=0;
			var isimListesi = [];
			var saatler;
			var atla=true;
			for (var i=0;i<profiller.length;i++)
				if (profiller[i][1]==kullanici)	{
					profilNo=i;
					saatler= profiller[profilNo][2];
					break;
				}

			var otoBekleme = (Math.round(Math.random() * 2)+2)*60; //3 ile 6 arasinda sayi uretilecek
			console.log("Okuma basliyor");
			var timerr=setInterval(function() {
				console.log("Okuma basliyor setInterval");
				msgSay=$(".container li.dm-nav span.count-inner").html();			
				atla=true;
				if (msgSay!="" && msgSay>0)
					{
						console.log("Okuma basliyor msgSay="+msgSay);
						atla=false;
						console.log("1. Okuma basliyor");
						DmKontrol((profilNo+1,"1").toString() +"_"+kullanici);
						console.log("1. Okuma bitti");
					}
				bekleme=30+bekleme;
				/*beklemepyl=beklemepyl+30;

				if (bekleme>3600 && beklemepyl>120)
					if saatKontol()
						location.reload(1);
					else
						beklemepyl=0;*/
				console.log("bekleme="+bekleme+" otoBekleme="+otoBekleme);
				
				if (bekleme>otoBekleme && saatKontol(saatler,periyot) && atla)
				{
					otoBekleme = (Math.round(Math.random() * 2)+2)*60;
					bekleme=0;
					console.log("2. Okuma basliyor");
					DmKontrol((profilNo+1,"1").toString() +"_"+kullanici);
					console.log("2. Okuma bitti");
				}
				if (bekleme>(otoBekleme*2))
					bekleme=0;
			},30000);
		}
	}
}
)();
