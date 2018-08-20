'use strict'

var ActiPub=require('./actiPubValidator');

function isUrl(str){
  var pattern = new RegExp('^(https?:\/\/)?'+ // protocol
  '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
  '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
  '(\:\d+)?(\/[-a-z\d%_.~+]*)*.$','i');
  return pattern.test(str);
}

function mainError(msg){
  var main=document.querySelector('main');
  main.innerHTML="<h1 class='error'>"+msg+"</h1>";
}

function grabJSON(id){
  var element=document.getElementById(id);
  var value = element.value;
  if (isUrl(value)){
    var xhr=new XMLHttpRequest();
    xhr.open("GET",value,true);
    xhr.setRequestHeader('Accept','application/ld+json; profile="https://www.w3.org/ns/activitystreams"')
    xhr.onload=function(e){
      if (xhr.status ===200){
        showValidity(xhr.responseText);
      } else if (xhr.status === 304){
        console.log("THIS IS WHAT 304 LOOKS LIKE!")
        console.log(xhr)
      } else {
        mainError("Request failed with code "+xhr.status+", "+xhr.statusText);
      }
    }
    xhr.onerror = function(e){
      mainError("Request Failed. Check URL or try again later?")
    }
    xhr.send();
  } else {
    showValidity(value);
  }
}

window.grabJSON=grabJSON;

function showValidity(str){
  var data=JSON.parse(str);
  var analysis=ActiPub.validate(data);
  var isError=analysis.errors.length>0;
  var myErrors={};
  for (var key in analysis.SourceErrors){
    var pre = key.split('.');
    var call = pre.splice(0).split('[');
    if (call.splice(0)[0] =! 'instance'){
      mainError("Something went wrong while evaluating the JSON.");
    }
    myErrors[call.concat(pre)]=analysis.sourceErrors[key];
  }
  showJSON(data, document.getElementsByTagName('main')[0], analysis.sourceErrors);
}

function showJSON(data, root, errors){
  var finalError;
  errors=errors || {};
  if (errors.FINAL_ERROR){
    finalError=errors.FINAL_ERROR;
    delete errors.FINAL_ERROR;
  }
  var self;
  if(typeof(data)=='string'){
    data = JSON.parse(data);
  }

  if(typeof(data)!='object'){
    console.log("showJSON requires an object as input");
  }
  if (data.length == undefined){
    self=document.createElement('dl')
    if(finalError){
      var div=document.createElement('div');
      var dd=document.createElement('dd');
      dd.innerHTML="ERROR";
      var dt=document.createElement('dt');
      dt.innerHTML=finalError.stack;
      dt.onmousedown=function(){
        console.log(finalError);
      }
      div.classList.add('error')
      div.appendChild(dd);
      div.appendChild(dt);
      self.append(div);
    }
    for(var name in data){
      var div=document.createElement('div');
      var dd=document.createElement('dd');
      dd.innerHTML=name;
      div.appendChild(dd);
      var datum=data[name];
      var dt=document.createElement('dt');
      if(typeof(datum)=='object'){
        showJSON(datum, dt, errors[name]);
      } else {
        if(errors[name]){
          datum=datum+"<em>error!</em>";
          dt.onmousedown=function(){
            console.log(errors[name]);
          }
        }
        dt.innerHTML=datum;
      }
      div.appendChild(dt);
      self.append(div);
    }
  }else{
    self = document.createElement('ol');
    if(finalError){
      var li=document.createElement('li');
      li.innerHTML="ERROR: "+finalError.stack;
      li.onmousedown=function(){
        console.log(finalError);
      }
      li.classList.add('error')
      self.appendChild(li);
    }
    for(var i =0; i<data.length; i++){
      var li=document.createElement('li');
      var datum=data[i];
      if(typeof(datum)=='object'){
        showJSON(datum, li, errors[i]);
      } else {
        if (errors[i]){
          datum=datum+"<em>error!</em>"
          li.onmousedown=function(){
            console.log(errors[i]);
          }
        }
        li.innerHTML=datum
      }
      self.appendChild(li)
    }
  }
  root.appendChild(self);
}