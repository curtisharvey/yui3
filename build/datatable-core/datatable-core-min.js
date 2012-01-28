YUI.add("datatable-core",function(b){var e=b.Attribute.INVALID_VALUE,g=b.Lang,d=g.isFunction,m=g.isObject,h=g.isArray,c=g.isString,l=g.isNumber,j=g.sub,f=b.Array,k=b.Object.keys,i;function a(p){var q={},n;for(n in p){q[n]=p[n];}return q;}i=b.namespace("DataTable").Core=function(){};i.ATTRS={columns:{validator:h,getter:"_getColumns"},recordType:{setter:"_setRecordType",writeOnce:true},data:{value:[],setter:"_setData",getter:"_getData"},headerView:{validator:"_validateView",writeOnce:true},footerView:{validator:"_validateView",writeOnce:true},bodyView:{validator:"_validateView",writeOnce:true},summary:{value:"",setter:b.Escape.html},caption:{value:""},recordset:{setter:"_setRecordset",getter:"_getRecordset"},columnset:{setter:"_setColumnset",getter:"_getColumnset"}};b.mix(i.prototype,{CAPTION_TEMPLATE:'<caption class="{className}"/>',TABLE_TEMPLATE:'<table role="presentation" class="{className}"/>',TBODY_TEMPLATE:'<tbody class="{className}"/>',TFOOT_TEMPLATE:'<tfoot class="{className}"/>',THEAD_TEMPLATE:'<thead class="{className}"/>',delegate:function(){var n=this.get("contentBox");return n.delegate.apply(n,arguments);},getCell:function(o,n){return this.body&&this.body.getCell&&this.body.getCell(o,n);},getColumn:function(p){var o,r,q,n,s;if(m(p)&&!h(p)){o=p;}else{o=this.get("columns."+p);}if(o){return o;}r=this.get("columns");if(l(p)||h(p)){p=f(p);s=r;for(q=0,n=p.length-1;s&&q<n;++q){s=s[p[q]]&&s[p[q]].children;}return(s&&s[q])||null;}return null;},getRow:function(n){return this.body&&this.body.getRow&&this.body.getRow(n);},syncUI:function(){this._uiSetCaption(this.get("caption"));this._uiSetSummary(this.get("summary"));},_afterColumnsChange:function(n){this._setColumnMap(n.newVal);this._setDisplayColumns(n.newVal);},bindUI:function(){},_createRecordClass:function(p){var o,q,n;if(h(p)){o={};for(q=0,n=p.length;q<n;++q){o[p[q]]={};}}else{if(m(p)){o=p;}}return b.Base.create("record",b.Model,[],null,{ATTRS:o});},_createTable:function(){return b.Node.create(j(this.TABLE_TEMPLATE,{className:this.getClassName("table")}));},_createTBody:function(){return b.Node.create(j(this.TBODY_TEMPLATE,{className:this.getClassName("data")}));},_createTFoot:function(){return b.Node.create(j(this.TFOOT_TEMPLATE,{className:this.getClassName("footer")}));},_createTHead:function(){return b.Node.create(j(this.THEAD_TEMPLATE,{className:this.getClassName("columns")}));},_defRenderBodyFn:function(n){n.view.render();this.body=n.view;this._tbodyNode=n.view.get("container");this._tableNode.append(this._tbodyNode);},_defRenderFooterFn:function(n){n.view.render();this.foot=n.view;this._tfootNode=n.view.get("container");this._tableNode.insertBefore(this._tfootNode,this._tableNode.one("> tbody"));},_defRenderHeaderFn:function(n){n.view.render();this.head=n.view;this._theadNode=n.view.get("container");this._tableNode.insertBefore(this._theadNode,this._tableNode.one("> tfoot, > tbody"));},_defRenderTableFn:function(p){var n,o;this._tableNode=this._createTable();if(p.headerView){o=a(p.headerConfig||{});o.container=this._createTHead();n=new p.headerView(o);n.addTarget(this);this.fire("renderHeader",{view:n});}if(p.footerView){o=a(p.footerConfig||{});o.container=this._createTFoot();n=new p.footerView(o);n.addTarget(this);this.fire("renderFooter",{view:n});}if(p.bodyView){o=a(p.bodyConfig||{});o.container=this._createTBody();n=new p.bodyView(o);n.addTarget(this);this.fire("renderBody",{view:n});}},_getColumns:function(o,n){return n.length>8?this._columnMap:o;},_getColumnset:function(o,n){return this.get(n.replace(/^columnset/,"columns"));},_getData:function(n){return this.data||n;},_initColumns:function(){var n=this.get("columns"),o=this.get("recordType");if(!n){n=(o&&o.ATTRS)?k(o.ATTRS):[];this.set("columns",n,{silent:true});}this._setColumnMap(n);this._setDisplayColumns(n);},_initData:function(){var o=this.get("data"),p,n;if(h(o)){p=this.get("recordType");n=o;o=new b.ModelList();if(p){o.model=p;o.reset(n,{silent:true});}this.set("data",o,{silent:true});}this.data=o;this.data.addTarget(this);},_initEvents:function(){this.publish({renderTable:{fireOnce:true,defaultFn:b.bind("_defRenderTableFn",this)},renderHeader:{fireOnce:true,defaultFn:b.bind("_defRenderHeaderFn",this)},renderBody:{fireOnce:true,defaultFn:b.bind("_defRenderBodyFn",this)},renderFooter:{fireOnce:true,defaultFn:b.bind("_defRenderFooterFn",this)}});},initializer:function(){this._initColumns();this._initRecordType();this._initData();this._initViewConfig();this._initEvents();this.after("columnsChange",this._afterColumnsChange);this._UI_ATTRS={BIND:this._UI_ATTRS.BIND.concat(["caption","summary"]),SYNC:this._UI_ATTRS.SYNC.concat(["caption","summary"])};},_initRecordType:function(){var p,n,q,o;if(!this.get("recordType")){p=this.get("data");n=this._columnMap;if(p.model){q=p.model;}else{if(p.size&&p.size()){q=p.model=p.item(0).constructor;}else{if(h(p)&&p.length){q=(p[0].constructor.ATTRS)?p[0].constructor:this._createRecordClass(k(p[0]));}else{if(k(n).length){q=this._createRecordClass(k(n));}}}}if(q){this.set("recordType",q,{silent:true});if(!n||!n.length){this._initColumns();}}else{o=this.after(["columnsChange","recordTypeChange","dataChange"],function(r){o.detach();if(!this.data.model){this._initRecordType();this.data.model=this.get("recordType");}});}}},_initViewConfig:function(){this._viewConfig={source:this,cssPrefix:this._cssPrefix};this._headerConfig=b.Object(this._viewConfig);this._bodyConfig=b.Object(this._viewConfig);this._footerConfig=b.Object(this._viewConfig);},_parseColumns:function(n){var q={},o={};function p(w){var v,r,s,u,t,x;for(v=0,r=w.length;v<r;++v){s=w[v];if(c(s)){w[v]=s={key:s};}t=b.stamp(s);if(h(s.children)){p(s.children);}else{u=s.key;if(u){q[s.key]=s;}x=s.name||s.key||s._yuid;if(o[x]){x+=(o[x]++);}else{o[x]=1;}s._id=x;q[x]=s;}}}p(n);return q;},renderUI:function(){var n=this.get("contentBox"),o;if(n){this._viewConfig.columns=this.get("columns");this._viewConfig.modelList=this.data;n.setAttribute("role","grid");this.fire("renderTable",{headerView:this.get("headerView"),headerConfig:this._headerConfig,bodyView:this.get("bodyView"),bodyConfig:this._bodyConfig,footerView:this.get("footerView"),footerConfig:this._footerConfig});
o=this._tableNode;if(o){if(!o.inDoc()||!o.ancestor().compareTo(n)){n.append(o);}}}},_setColumnMap:function(n){this._columnMap=this._parseColumns(n);},_setColumnset:function(n){if(n&&n instanceof b.Columnset){n=n.get("definitions");}return h(n)?n:e;},_setData:function(n){if(n===null){n=[];}if(h(n)){if(this.data){if(!this.data.model&&n.length){this.set("recordType",k(n[0]));}this.data.reset(n);n=true;}}else{if(n&&n.each&&n.getAttrs){this.data=n;}else{n=e;}}return n;},_setDisplayColumns:function(n){function o(t){var s=[],r,p,q;for(r=0,p=t.length;r<p;++r){q=t[r];if(q.children){s.push.apply(s,o(q.children));}else{s.push(q);}}return s;}this._displayColumns=o(n);},_setRecordset:function(o){var n;if(o&&o instanceof b.Recordset){n=[];o.each(function(p){n.push(p.get("data"));});o=n;}return o;},_setRecordType:function(o){var n;if(d(o)&&o.prototype.set&&o.prototype.getAttrs){n=o;}else{if(m(o)){n=this._createRecordClass(o);}}return n||e;},_uiSetCaption:function(q){var p=this._tableNode,o=this._captionNode,n;if(q){if(!o){this._captionNode=o=b.Node.create(j(this.CAPTION_TEMPLATE,{className:this.getClassName("caption")}));n=b.stamp(o);o.set("id",n);p.prepend(this._captionNode);p.setAttribute("aria-describedby",n);}o.setContent(q);}else{if(o){o.remove(true);delete this._captionNode;p.removeAttribute("aria-describedby");}}},_uiSetSummary:function(n){this._tableNode.setAttribute("summary",n||"");},_uiSetWidth:function(n){if(l(n)){n+=this.DEF_UNIT;}if(c(n)){this._uiSetDim("width",n);this._tableNode.setStyle("width",n);}},_validateView:function(n){return n===null||(d(n)&&n.prototype.render);}});},"@VERSION@",{requires:["escape","model-list","node-event-delegate"]});