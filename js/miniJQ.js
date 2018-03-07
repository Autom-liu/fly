
~function(){
	function $(prap){
		var prapType = Object.prototype.toString.call(prap).toLowerCase();
		if(/function/.test(prapType)){ window.onload = prap; }
		else if ( /html/.test(prapType) ){ return new Init(prap); }
	}

	function Init(prap){
		this.jsObj = new Array(prap);
	}

	Init.prototype = {
		each: function(excel){
			this.jsObj.forEach(function(ele,index){
				excel.call(ele,index);
			})
		},
		
		css: function(){
			var args = arguments;
			if(arguments.length === 2){
				this.each(function(){
					this.style[args[0]] = args[1];
				})
			}else if(arguments.length === 1){
				switch( (typeof args[0]).toLowerCase()){
					case 'string': return getStyle(this.jsObj[0],args[0]);
					case 'object': setStyle.call(this,args[0]);
				}
			}


			return this;

			function getStyle(obj,attr){
				var value = obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj)[attr];
				return parseInt(value) ? parseInt(value): value;
			}

			function setStyle(attrs){
				for(attr in attrs){this.each(function(){this.style[attr] = attrs[attr];})}
			}
		},

		append: function(element){
			this.each(function(){this.appendChild(element)});
			return this;
		},
		html: function(innerHTML){
			this.each(function(){this.innerHTML = innerHTML;});
			return this;
		},
		text: function(innerText){
			this.each(function(){this.innerText = innerText;});
			return this;
		},
		addClass: function(className){
			className = className.split(' ').filter(function(value){return value!= '';});
			this.each(function(){
				for(var i=0,len = className.length;i<len;i++){
					if(this.className.indexOf(className[i]) === -1){
						this.className +=  ( this.className?  ' '+className[i]: className[i]);
					}
				}
			});
			return this;
		},
		removeClass: function(className){
			className = className.split(' ').filter(function(value){return value!= '';});
			this.each(function(){
				var thisCName = this.className.split(' ').filter(function(value){
					var ret = value !== '';
					if (ret){
						for(var i=0,len = className.length;i<len;i++){
							ret = value !== className[i];
						}
					}
					return ret;
				});
				this.className = thisCName.join(" ");
				
			});
			return this;
		}
	}

	window.$ = $;

}();