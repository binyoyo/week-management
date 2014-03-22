$(function () {  
    var eventModel = Backbone.Model.extend({ 
        validate: function(atts){
            if(atts['name']==''){
                return '事件不能为空';
            }
        },
        defaults:{
            done:false
        }
    });  
      
	var	eventModelCollection = Backbone.Collection.extend({
    	model: eventModel,
    	localStorage: new Store('121111')
  });
    var Events=new eventModelCollection;
    //事件详细内容的View
    var eventView = Backbone.View.extend({
        tagName: 'li',
        template : _.template($('#content-template').html()),
        initialize : function(){
            this.model.bind('change', this.render, this);
        },
        events :{
            "click #finish" : "finish",
            "click #cancel" : "cancel",
            "click #delete" : "delete",
            "click #content" : "edit",
            "blur #edit" : "save",
        },
        render:function(){
            $(this.el).html(this.template(this.model.toJSON()))
            return this;
        },
        finish:function(){
            this.model.save({done: true});
            $(this.el).addClass('done');
        },
        cancel:function(){
            this.model.save({done: false});
            $(this.el).removeClass('done');
        },
        delete:function(){
            this.model.destroy();
            $(this.el).remove();
        },
        edit:function(){
            $(this.el).find('table').css('display','none');
            $(this.el).find('input').val(this.model.get('name'))
                                    .css('display','block')
                                    .focus();
            console.log(this.model.get('name'));
        },
        save:function(){
            var input=$(this.el).find('input');
            this.model.save({name: input.val()});
            input.css('display','none');
            $(this.el).find('table').css('display','table');
        }

    });  

    var indexModel = Backbone.View.extend({  
        el: $("body"),  
        initialize: function () {  
            Events.bind('add',this.loadOne,this);
            Events.bind('reset',this.loadAll,this);
            Events.fetch();
        },  
        events: {  
            "click #add":  "checkIn" 
        },  
        checkIn: function () {  
            var eventone = new eventModel();  
            var attr ={};
            //添加并清空输入框
            $('input,select').each(function(){
                                var input =$(this);
                                attr[input.attr('name')]=input.val();
                                })
                             .val('');
            eventone.bind('error',function(model,error){
                alert(error);
            });
            
            if(eventone.set(attr)){
            	Events.create(eventone);
			};                        
        },  
        loadOne : function(eventone) { 
            var eventmodelview= new eventView({model:eventone});
            if(eventone.get('done')){
                $(eventmodelview.el).addClass('done');
            }
            $('#'+eventone.get('day')).append(eventmodelview.render().el); 
        },
        loadAll: function(){
        	Events.each(this.loadOne);
        }  
    });  
    //实例化indexModel  
    var indexmodel = new indexModel(); 
});