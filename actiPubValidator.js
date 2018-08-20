'use strict';

function multiple(obj){
  return {
    oneOf:[
    obj,{
      type:'array',
      items:obj
    }]
  }
}

var id_prop={
  id:'/id_prop',
  //required:true,
  type:'string',
  format:'url',
  //pattern:'^(https?:\/\/)(\w+(\.\w+)+)\/?[\S]+',
}

var base={
  "id":{
    '$ref':'/id_prop',
  }
}

var objlink_domain={
  "id":{
    '@ref':'/id_prop'
  },
  "type":{
    type:'string',
    //Ehm. Not sure.
    required:true,
  },
  "attributedTo":multiple({
    type:'array',
    required:false,
    items:{
      '$ref':'/ObjLink'
    }
  }),
  "name":{
    oneOf:[{
      type:'string'
    },{
      type:'object',
      'patternProperties':{
        '\w{2,}':{
          type:'string'
        }
      }
    }]
  },
  "nameMap":{
    type:'object',
    'patternProperties':{
      '\w{2,}':{
        type:'string'
      }
    }
  },
  "preview":multiple({
    '$ref':'/ObjLink'
  }),
  "mediaType":multiple({
    type:'string'
    //additional validation: needs to be MIME Media Type!
  })
}

var link_domain={...objlink_domain,...{
  "type":{
    type:'string',
    pattern:[
      "Link",
      "Mention"
    ].join('|')
  },
  "href":{
    type:'string',
    //pattern:'^(https?:\/\/)(\w+(\.\w+)+)\/?[\S]+',
    format:'url'
  },
  "hreflang":{
    type:'string'
    //additional validation: Needs to be BCP47 language tag!
  },
  "rel":multiple({
    type:'string',
    //additional validation: Can't contain the "space" U+0020, "tab" (U+0009), "LF" (U+000A), "FF" (U+000C), "CR" (U+000D) or "," (U+002C) characters
  }),
  //this has to be functional, anything else doesn't make sense!
  "height":{
    type:'integer',
    minimum:0
  },
  "width":{
    type:'integer',
    minimum:0
  }
}}

var obj_domain={...objlink_domain,...{
  "type":{
    type:'string',
    required:true,
    pattern:[
      "Object",
      "Application",
      "Group",
      "Organization",
      "Person",
      "Service",
      "Article",
      "Document",
      "Audio",
      "Image",
      "Video",
      "Note",
      "Page",
      "Event"
    ].join('|')
  },
  "attachment":{
    type:'array',
    required:false,
    items:{
      '$ref':'/ObjLink'
    }
  },
  "audience":{
    '$ref':'/ObjLink'
  },
  "to":{
    '$ref':'/ObjLink'
  },
  "cc":{
    '$ref':'/ObjLink'
  },
  "bcc":{
    '$ref':'/ObjLink'
  },
  "bto":{
    '$ref':'/ObjLink'
  },
  "content":{
    '$ref':'/ObjLink'
  },
  "contentMap":{
    required:false,
    patternProperties:{
      '\w{2,}':{
        type:'string'
      }
    }
  },
  //WARNING: Spec is "intentionally vague". Other types might be applicable?
  "context":{
    '$ref':'/ObjLink'
  },
  "name":{
    type:'string',
  },
  "endTime":{
    type:'string',
    format:'date-time'
  },
  "generator":{
    '$ref':'/ObjLink'
  },
  "icon":{
    '$ref':'/ImgLink'
  },
  "image":{
    '$ref':'/ImgLink'
  },
  "inReplyTo":{
    '$ref':'/ObjLink'
  },
  "location":{
    '$ref':'/ObjLink'
  },
  "replies":{
    '$ref':'/Collection'
  },
  "tag":{
    '$ref':'/ObjLink'
  },
  "url":{
    '$ref':'/Link'
  },
  "duration":{
    'type':'string'
    //additional validation to come. Need to find "xsd-duration"-regex
  },
  "published":{
    type:'string',
    format:'date-time'
  },
  "updated":{
    type:'string',
    format:'date-time'
  },
  "startTime":{
    type:'string',
    format:'date-time'
  },
  "endTime":{
    type:'string',
    format:'date-time'
  },
  'summary':{
    oneOf:[{
      type:'string'
    },{
      type:'object',
      patternProperties:{
        '\w{2,}':{
          type:'string'
        }
      }
    }]
  },
  'summaryMap':{
    type:'object',
    patternProperties:{
      '\w{2,}':{
        type:'string'
      }
    }
  },
}}

var intrActivity_domain={...obj_domain,...{
  "type":{
    type:'string',
    pattern:[
      "IntransitiveActivity",
      "Arrive",
      "Travel",
    ].join('|')
  },
  "actor":{
    '$ref':'/ObjLink'
  },
  "instrument":{
    '$ref':'/ObjLink'
  },
  "origin":{
    '$ref':'/ObjLink'
  },
  "result":{
    '$ref':'/ObjLink'
  },
  "target":{
    '$ref':'/ObjLink'
  }
}}

//actually, intraActvitiy is a subtype of activity.
//however, it's easier to test for one added property,
//than for the removal of thesame.
var activity_domain={...intrActivity_domain,...{
  "type":{
    type:'string',
    pattern:[
      "Activity",
      "Accept",
      "TentativeAccept",
      "Create",
      "Delete",
      "Follow",
      "Ignore",
      "Join",
      "Leave",
      "Like",
      "Offer",
      "Invite",
      "Reject",
      "TentativeReject",
      "Remove",
      "Undo",
      "Update",
      "View",
      "listen",
      "Read",
      "Move",
      "Announce",
      "Block",
      "Add",
      "Flag",
      "Dislike"
    ].join('|')
  },
  "object":{
    '$ref':'/ObjLink'
  },
}}

var collection_domain={...obj_domain,...{
  "type":{
    type:'string',
    pattern:[
      "Collection",
      "OrderedCollection"
    ].join('|')
  },
  "items":{
    required:true,
    type:'array',
    items:{
      '$ref':'/ObjLink'
    }
  },
  "totalItems":{
    required:true,
    type:'integer',
    minimum:0
  },
  "current":{
    '$ref':'/ColPageLink'
  },
  "first":{
    '$ref':'/ColPageLink'
  },
  "last":{
    '$ref':'/ColPageLink'
  }
}}

var colPage_domain={...collection_domain,...{
  "type":{
    type:'string',
    pattern:"CollectionPage"
  },
  "next":{
    '$ref':'/ColPageLink'
  },
  "prev":{
    '$ref':'/ColPageLink'
  },
  "partOf":{
    oneOf:[{
      '$ref':'/Link'
    },{
      '$ref':'/Collection'
    }]
  }
}}

var question_domain={...intrActivity_domain,...{
  "type":{
    type:'string',
    pattern:"Question"
  },
  "oneOf":{
    '$ref':'/ObjLink'
  },
  "anyOf":{
    '$ref':'/ObjLink'
  },
  "closed":{
    oneOf:[{
      type:'boolean'
    },{
      type:'string',
      format:'date-time'
    },{
      '$ref':'/ObjLink'
    }]
  }
}}

var relation_domain={...obj_domain,...{
  "type":{
    type:'string',
    pattern:"Relationship"
  },
  "subject":{
    '$ref':'/ObjLink'
  },
  //I suspect 'functionality'?
  "relationship":{
    '$ref':'/ObjLink'
  },
  "object":{
    '$ref':'/ObjLink'
  }
}}

var ordColPage_domain={...colPage_domain,...{
  "type":{
    type:'string',
    pattern:"OrderedCollectionPage"
  },
  "startIndex":{
    type:'integer',
    minimum:0 
  },
}}

var place_domain={...obj_domain,...{
  "type":{
    type:'string',
    pattern:'Place'
  },
  "accuracy":{
    type:'number',
    minimum:0,
    maximum:100
  },
  "altitude":{
    type:'number',
    //'minimum':0 //well. What about Holland?
  },
  "latitude":{
    type:'number'
  },
  "longitude":{
    type:'number'
  },
  "radius":{
    type:'number',
    minimum:0
  },
  "units":{
    type:'string'
    //additional validation: applicable unit, or url
  }
}}

var profile_domain={...obj_domain,...{
  "type":{
    type:'string',
    pattern:'Profile'
  },
  "describes":{
    oneOf:[{
      type:'string',
      //pattern:'^(https?:\/\/)(\w+(\.\w+)+)\/?[\S]+',
      format:'url'
    },{
      type:'object',
      properties:obj_domain
    }]
  }
}}

var tombstone_domain={...obj_domain,...{
  "type":{
    type:'string',
    pattern:'Tombstone'
  },
  //According to spec, "former Type" can be an object
  //But that makes no sense to me? I assume an error.
  "formerType":{
    oneOf:[{
      type:'string'
    },{
      type:'array',
      items:{
        type:'string'
      }
    }]
  },
  "deleted":{
    type:'string',
    format:'date-time'
  }
}}

var pureLink={
  'oneOf':[{
    type:'object',
    additionalProperties:false,
    properties:link_domain
  },
  {
    type:'string',
    //pattern:'^(https?:\/\/)(\w+(\.\w+)+)\/?[\S]+',
    format:'url'
  }]
}

var Link={
  id:'/Link',
  oneOf:[{
    type:'array',
    items:pureLink
  },pureLink]
}

var ColPageLink={
  id:'/ColPageLink',
  oneOf:[{
    type:'object',
    additionalProperties:false,
    properties:ordColPage_domain
  },{
    type:'object',
    additionalProperties:false,
    properties:colPage_domain
  },{
    type:'string',
    //pattern:'^(https?:\/\/)(\w+(\.\w+)+)\/?[\S]+',
    format:'url'
  }]
}

var Collection={
  id:'/Collection',
  type:'object',
  additionalProperties:false,
  properties:collection_domain
}

var pureObjLink={
  oneOf:[{
    type:'object',
    additionalProperties:false,
    properties:tombstone_domain
  },{
    type:'object',
    additionalProperties:false,
    properties:activity_domain
  },{
    type:'object',
    additionalProperties:false,
    properties:relation_domain
  },{
    type:'object',
    additionalProperties:false,
    properties:intrActivity_domain
  },{
    '$ref':'/Collection'
  },{
    type:'object',
    additionalProperties:false,
    properties:profile_domain
  },{
    type:'object',
    additionalProperties:false,
    properties:place_domain
  },{
    '$ref':'/ColPageLink'
  },{
    type:'object',
    additionalProperties:false,
    properties:obj_domain
  },{
    type:'object',
    additionalProperties:false,
    properties:link_domain
  },{
    type:'string',
    //pattern:'^(https?:\/\/)(\w+(\.\w+)+)\/?[\S]+',
    format:'url'
  }]
}

var ObjLink={
  id:'/ObjLink',
  oneOf:[{
    type:'array',
    items:pureObjLink
  },pureObjLink]
}


var pureImgLink={
  oneOf:[{
    type:'object',
    additionalProperties:false,
    properties:{...obj_domain,...{
      "type":{
        type:'string',
        pattern:"Image"
      }
    }}
  },{
    type:'object',
    properties:link_domain
  },{
    type:'string',
    //pattern:'^(https?:\/\/)(\w+(\.\w+)+)\/?[\S]+',
    format:'url'
  }]
}

var ImgLink={
  id:'/ImgLink',
  oneOf:[{
    type:'array',
    items:pureImgLink
  },pureImgLink]
}

var Validator=require('jsonschema').Validator;
var V = new Validator();

V.addSchema(ImgLink, '/ImgLink');
V.addSchema(ObjLink, '/ObjLink');
V.addSchema(Link, '/Link');
V.addSchema(Collection, '/Collection');
V.addSchema(ColPageLink, '/ColPageLink');

module.exports.validate=function (obj){
  var valid= V.validate(obj, ObjLink,{nestedErrors:true, disableFormat:false});
  valid.sourceErrors={}
  var had_it=[];
  for (var err in valid.errors){
    var e=valid.errors[err]
    if (e.name=='required' && e.property){
      var particles=e.property.split('.');
      var sample=obj;
      for (var i = 1; i < particles.length-1 ; i++) {
        var particle = particles[i];
        var parts = particle.split('[');
        particle=parts[0];
        sample = sample[particle];
        if(parts.length>1){
          sample=sample[parts[1].split(']')[0]] //srsly???
        }
      }
      if(sample && sample.type && 0>collection_domain.type.pattern.indexOf(sample.type)){
        continue
      }
    }
    //                                                       EViL HACK TO FILTER OUT 'oneOf':[thing, {list of [thing]}]
    if (e.name=='oneOf' || typeof(e.instance) == 'string' || (e.schema.items && e.schema.items.oneOf)){//e.name == 'oneOf' || (e.name=='type' && e.argument[0]=='string')){
      continue
    }
    if(typeof(e.instance) == 'object' && e.schema.properties && e.schema.properties.type.type=='string' && 0>e.schema.properties.type.pattern.indexOf(e.instance.type)){
      continue
    }
    if(typeof(e.instance) == 'object' && e.schema.type=='string'){
      continue
    }
    if(had_it.indexOf(e.property)>-1){
      continue
    }
    had_it.push(e.property)
    var tp=e.property.split('.')
    if(tp[tp.length-1]=='type'&&false){
      continue
    }

    var props=e.property.split('.');
    var last='instance';
    var carry={'instance':valid.sourceErrors};
    for(var i=1; i<props.length;i++){
      carry=carry[last];
      var prop=props[i];
      var list=prop.split('[');
      if(list.length>1){
        carry[list[0]]=carry[list[0]] || {};
        carry=carry[list[0]];
        prop=list[1].split(']')[0];
      }
      carry[prop]=carry[prop] || {};
      last=prop;
    }
    carry[last]={FINAL_ERROR:e};
  }

  return valid
}