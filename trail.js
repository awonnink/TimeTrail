import {spUtills} from './spUtils.js';	
import {config} from './config.js'	

export class Vector2 {
    constructor(x,y){
        this.x=x;
        this.y=y;
    }
    lengthSquared(){
        return this.x*this.x+this.y*this.y;
    }
    length(){
        return Math.sqrt( this.lengthSquared());
    }
    add(v){
        return new Vector2(this.x+v.x, this.y+v.y)
    }
    sub(v){
        return new Vector2(this.x-v.x, this.y-v.y)
    }
    distanceTo(v){
        var d=this.sub(v);
        return d.length();
    }
    normalize(fact){
        var le=this.length();
        fact=fact??1;
        return new Vector2(fact*this.x/le, fact*this.y/le);
    }
    eq(v){
        return this.x==v.x && this.y==v.y;
    }
    static random(fact){
        var v=new Vector2(Math.random(), Math.random());
        return v.normalize(fact);
    }
    static mean(varr){
        var q=new Vector2(0,0);
        var le=varr.length;
        for(var n=0;n<le;n++){
            q=q.add(varr[n]);
        }
        return new Vector2(q.x/le, q.y/le);
    }

}

export class FrameProps{

    constructor(fp){
        this.id=fp.id;
        this.date=fp.date;
        this.label=fp.label;
        this.type=fp.type;
        this.url=fp.url;
        this.siteurl=fp.siteUrl;
        this.top=fp.top;
        this.left=fp.left;
        this.width=fp.width??200;
        this.height=fp.height??150;
        this.parentName=fp.parentName;
    }
}

export class ScreenElement{
    constructor(trailHandler) {
        this.trailHandler=trailHandler;
        this.props.pinned=false;
    }
    scale=1;
    element=null;
    props={};
    autoScale=true;
    handleAutoScale=true;
    autoPosition=true;
    highlightClassName='highlight';
    buzyClassName='busy';
    noResultsClassName='noResults';
    static lastZindex=0;
    getNextZindex(){
        ScreenElement.lastZindex++;
        return ScreenElement.lastZindex;
    }
    makeElement(elementName, id, className, parent){
        var d=document.createElement(elementName);
        if(id){
            d.id=id;
        }
        if(className){
            d.setAttribute('class',className)
        }
        if(parent){
            parent.appendChild(d);
        }
        return d;
    }
    makeSearch(id, className, parent){
        var inp= this.makeElement('input', id, className, parent);
        inp.setAttribute('type','search');
        return inp;
    }
    setBusy(set){
        if(this.element){
            if(set){
                this.element.classList.add(this.buzyClassName);
                this.element.style.animation = "steam 20s linear infinite";
	            this.element.style.webkitAnimation = "steam 20s linear infinite";
            }
            else{
                this.element.classList.remove(this.buzyClassName);
            }
        }
    }

    makeDiv(id, className, parent){
        return this.makeElement('div', id, className, parent);
    }
    makeSpan(id, className, parent){
        return this.makeElement('span', id, className, parent);
    }
    makeIFrame(id, url, className, parent){
        var ifr=this.makeElement('iframe',id,className, parent);
        ifr.src=url;
        return ifr;
    }
    makeRadio(id, className, parent, groupName){
        var rbn=this.makeElement('input',id, className, parent, groupName);
        rbn.setAttribute('type','radio');
        if(groupName){
            rbn.setAttribute('name',groupName);
        }
        
        return rbn;
    }
    makeRadioDiv(id, className, parent, groupName, text, clickevent){
        var parentDiv=this.makeDiv(null,className, parent);
        var rbn=this.makeRadio(id, `${className}rbn`, parentDiv, groupName, clickevent);
        var txtDiv=this.makeDiv(id, `${className}lbl`, parentDiv, groupName);
        txtDiv.innerText=text;
        return rbn;
    }
    setWidthHeight(){
        if(this.element&& this.props.w && this.props.h){
            var screenScale=this.getScreenScale();
            this.element.style.width=`${screenScale*this.scale*this.props.w}px`;
            this.element.style.height=`${screenScale*this.scale*this.props.h}px`;
        }
    }
    getScreenScale(){
        if(this.trailHandler && this.trailHandler.sliderBar){
            return this.trailHandler.sliderBar.currentScale;
        }
        return 1;
    }
    setScale(s){
        this.scale=s;
        this.setWidthHeight();	
    }

    assureParent(){
        var parent=null;
        if(this.props && this.props.parentName){
            parent= document.getElementById(this.props.parentName);
        }
        if(!parent){
            parent=document.getElementById('main');
        }
        if(!parent){
            parent=document.body;
        }
        return parent;
    }
    removeAllChildren(ele){

        while (ele.childNodes.length>0) {
            ele.removeChild(ele.lastChild)
        }
    
    }
    highlight(show){
        if(show){
            this.element.classList.add(this.highlightClassName);
            window.setTimeout(()=>{this.highlight();}, 1000);
        }
        else{
            this.element.classList.remove(this.highlightClassName);
        }

    }
    static setPosition(e, x, y){
        e.style.left=`${x}px`;
        e.style.top=`${y}px`;
    }
    static setPositionByVector(e, v){
        if(e){
            ScreenElement.setPosition(e, v.x, v.y);
        }
    }
    static setSize(e, w, h){
        e.style.width=`${w}px`;
        e.style.height=`${h}px`;
    }
    static setSizeByVector(e, v){
        ScreenElement.setSize(e, v.x, v.y);
    }
    static getSize(e){
        var w=e.offsetWidth;
        var h=e.offsetHeight;
        return new Vector2(w,h);
    }
    static makeNumber(styleValue){
        if(styleValue && styleValue.length>2){
        Number(styleValue.substring(0, styleValue.length-2));
        }
    }
    getPoints(){
        var a=[];
        if(this.element){
            var x1=this.element.offsetLeft;
            var x2=this.element.offsetLeft+this.element.offsetWidth;
            var y1=this.element.offsetTop;
            var y2=this.element.offsetTop+this.element.offsetHeight;
            a.push(new Vector2(x1,y1));
            a.push(new Vector2(x2,y1));
            a.push(new Vector2(x1,y2));
            a.push(new Vector2(x2,y2));
        }
        return a;
    }

    getCenter(){
        var a=this.getPoints();
        return Vector2.mean(a);
    }
    radius(){
        return this.getCenter().distanceTo(this.getPoints()[0]);
    }
    getP1(){
        var x=this.element.style.left;
        var y=this.element.style.top;
        if(x.length>2){
            x=Number(x.substring(0, x.length-2));
        }
        else{
            x=0;
        }
        if(y.length>2){
            y=Number(y.substring(0, y.length-2));
        }
        else{
            y=0;
        }
        
        return new Vector2(x, y); 
    }
    setP1(v, force){
        if(!this.element.lastDragged || force){
            this.element.style.left=`${v.x}px`;
            this.element.style.top=`${v.y}px`;
        }
    }
    getBoundingBox(){
        var pnts=this.getPoints();
        var p1=pnts[0];
        var p4=pnts[3];
        return {'x1':p1.x, 'y1':p1.y,'x2':p4.x, 'y2':p4.y};
    }
    savePosition(){
        var p=this.getP1();
        var z=ScreenElement.getSize(this.element);
        if(this.screenField==null || p.distanceTo(this.screenField.effectPosition)>this.screenField.effectRadius){
            this.props.x=p.x;
            this.props.y=p.y;
            this.props.w=z.x;
            this.props.h=z.y;
            if(this.screenField && this.screenField.presentingFrame==this){
                this.screenField.presentingFrame=null;
            }
        }
  
    }
}

export class Frame extends ScreenElement{
    constructor(trailHandler, frameProps, screenField) {
        super(trailHandler);
        this.props = frameProps;
        this.screenField=screenField;
        this.checkProps();
    }
    defaultWidth=500;
    defaultHeight=700;
    frameClassName='frameClass';
    frameDivClassName='frameDivClass';
    frameDivTitleClassName='frameDivTitleClass';
    frameContenContainerClassName='frameContenContainerClass';
    frameDivTitlePresentBtnClassName='frameDivTitlePresentBtnClass';
    frameDivTitleRightMenuClassName='frameDivTitleRightMenuClass';
    frameDivTitlePinnBtnClassName='frameDivTitlePinnBtnClass';
    frameDivTitleCloseBtnClassName='frameDivTitleCloseBtnClass';
    pinnedClassName='pinned';
    contentDiv=null;
    contentContainerDiv=null;
    showTitlebuttons=true;
    Init(){
        this.makeFrame();
    }
    checkProps(){
        if(!this.props){
            this.props={};
        }
        if(!this.props.x && this.props.x!=0){
            this.props.x=0;
            this.props.y=0;
            this.props.w=this.defaultWidth;
            this.props.h=this.defaultHeight;
        }
    }

    makeFrame(){
        var f=this.props;
        f.id=f.id??`_${this.trailHandler.spUtills.getRandomId()}`;
        //main div
        this.element=this.makeDiv(f.id,this.frameDivClassName, this.assureParent());
        this.element.style.left=`${f.x}px`;
        this.element.style.top=`${f.y}px`;
        this.element.style.zIndex=this.getNextZindex();
        this.setWidthHeight(f);

        //header
        var frdt=this.makeDiv(`${f.id}header`,this.frameDivTitleClassName, this.element);
        if(this.showTitlebuttons){
            var frpresent=this.makeDiv(`${f.id}present`,this.frameDivTitlePresentBtnClassName, frdt);
            frpresent.title='Present';
            frpresent.addEventListener('click', (e)=>{
                e = e || window.event;
                e.preventDefault();
                this.present();
            });
            var rightTitleMenu=this.makeDiv(`${f.id}pin`,this.frameDivTitleRightMenuClassName, frdt);
            var frpin=this.makeDiv(`${f.id}pin`,this.frameDivTitlePinnBtnClassName, rightTitleMenu);
            frpin.title='Pin';
            frpin.addEventListener('click', (e)=>{
                e = e || window.event;
                e.preventDefault();
                this.switchPinned(e);
            });
            var close=this.makeDiv(`${f.id}close`,this.frameDivTitleCloseBtnClassName, rightTitleMenu);
            close.title='Close';
            close.addEventListener('click', (e)=>{
                e = e || window.event;
                e.preventDefault();
                this.trailHandler.removeFrame(this);
               //this.element.parentNode.removeChild(this.element);
            });
               }
          var frdtc=this.makeSpan(null, null, frdt);
        frdtc.innerText=f.label;
        
        //content
        this.contentContainerDiv=this.makeDiv(`content${f.id}`,this.frameContenContainerClassName, this.element);
        if(f.url && f.url.length>0){
            this.contentDiv=this.makeIFrame(`ifr${f.id}`,f.url, this.frameClassName, this.contentContainerDiv);
        }
        else{
            this.contentDiv=this.makeDiv(`content${f.id}`,this.frameClassName, this.contentContainerDiv);
        }

        //general
        this.dragElement(this.element, this);
        f.visible=true;
        
    }
    switchPinned(e){
        var b=e.currentTarget;
        this.props.pinned=!this.props.pinned;
        if(!this.props.pinned){
             b.classList.remove(this.pinnedClassName)
             b.title='Pin'
        }
        else
        {
            b.classList.add(this.pinnedClassName)
            b.title='Unpin'
        }
    }

    presentStatus=0;
    target=null;
    present(){
        var p=this.getP1();
        if(this.screenField && this.presentStatus==0){
            if(p.distanceTo(this.screenField.effectPosition)>10){
                if(this.screenField.presentingFrame!=null  && this.screenField.presentingFrame!=this){
                    this.screenField.presentingFrame.present();
                }
                this.screenField.presentingFrame=this;
                this.presentStatus=1;
                this.target=this.screenField.effectPosition;
                this.element.style.zIndex=20;
                if(this.autoScale){
                    this.handleAutoScale=true;
                }
                if(this.props.editurl && !this.props.editing){
                    this.contentDiv.src=this.props.editurl;
                    this.props.editing=true;
                }

            }
            else{
                this.presentStatus=2;
                this.target=new Vector2(this.props.x, this.props.y);
                this.element.style.zIndex=9;
            }
            this.element.dragging=true;
        }
    }
    checkPresent(){
        if(this.presentStatus>0){//this.screenField && 
            var p=this.getP1();
            var s=ScreenElement.getSize(this.element);

            var d=p.sub(this.target);
            var normalize=100;
            var dl=d.length();
            normalize=dl/20;
            //if(d.length()>20?10:3;
            var dp=d.normalize(normalize);
            p=p.sub(dp);
            this.setP1(p, true)
            if(this.presentStatus==2){
                var difw=s.x-this.props.w;
                var signw=Math.sign(difw);
                if(Math.abs(difw)>4){
                    var nw=s.x-signw*5;
                    this.element.style.width=`${nw}px`;
                }
                var difh=s.y-this.props.h;
                var signh=Math.sign(difh);
                if(Math.abs(difh)>4){
                    var nh=s.y-signh*5;
                    this.element.style.height=`${nh}px`;
                }
            }

            if(d.length()<4){
                this.setP1(this.target, true)
                this.element.dragging=false;
                if(this.screenField.presentingFrame==this && this.presentStatus==2 ){
                    this.screenField.presentingFrame=null;
                }
                this.presentStatus=0;
            }
        }
    }

    dragElement(elmnt, self) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        var zoomScale=1;
        if (document.getElementById(elmnt.id + "header")) {
            // if present, the header is where you move the DIV from:
            document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
        }
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            clearDragged();
            zoomScale=self.trailHandler && self.trailHandler.sliderBar?self.trailHandler.sliderBar.currentScale:1;
            // get the mouse cursor position at startup:
            pos3 = e.clientX/zoomScale;
            pos4 = e.clientY/zoomScale;
            document.onmousedown = openDragElement;

            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
            elmnt.lastDragged=true;
            elmnt.dragging=true;
            return false;
        }
        function openDragElement(e){
            self.element.style.zIndex=self.getNextZindex();
        }
        var removeDown=null;
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            var scaledMouseX=e.clientX/zoomScale
            var scaledMouseY=e.clientY/zoomScale
            pos1 = pos3 - scaledMouseX;
            pos2 = pos4 - scaledMouseY;
            pos3 = scaledMouseX;
            pos4 = scaledMouseY;

            if(!removeDown && pos1<1 && pos2<1 ){//sometimes the mouse up will not be triggered, becuase it is on an iframe
                removeDown=window.setTimeout(()=>{
                    closeDragElement();
                },5000);
            }
            else if(pos1>1 || pos2>1 ){
                removeDown=null;
            }
            
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            // var f=self.getFrameById(elmnt.id);
            // f.x=elmnt.offsetTop;
            // f.y=elmnt.offsetLeft;
            return false;
       }

        function closeDragElement() {
 
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
            elmnt.dragging=false;
            self.savePosition();
            return false;
        }
        function clearDragged(){
        document.querySelectorAll(`.${self.frameDivClassName}`).forEach((f)=>{
            if(f.lastDragged){
                f.lastDragged=false;
            }
         });
    }

    }

    static checkOverlap(f1,f2){
        var c1=f1.getCenter();
        var c2=f2.getCenter();

        var r1=f1.radius();
        var r2=f2.radius();
        if(c1.distanceTo(c2)>(r1+r2)){
            return;
        }
        if(c1.eq(c2)){
            f1.setP1(f1.getP1().add(Vector2.random(2*f1.radius())));
            //return;
            c1=f1.getCenter();
        }
        if(!Frame.overlaps(f1,f2)){
            return;
        }
        var d=c1.sub(c2).normalize(10);
        if(f1.autoPosition){
            f1.setP1(f1.getP1().add(d));
        }
        if(f2.autoPosition){
            f2.setP1(f2.getP1().sub(d));
        }
        
    }
    static overlaps(f1, f2){
        var p1=f1.getPoints();
        var ol=false;
        p1.forEach((p)=>{
            if(!ol && Frame.pointInSquare(p, f2)){
                ol=true;
            }
        });
        return ol;
    }
    static pointInSquare(p, d){
        var bb=d.getBoundingBox();

        if(p.x<bb.x1 || p.x>bb.x2){
            return false;
        }
        if(p.y<bb.y1 || p.y>bb.y2){
            return false;
        }

        return true;
    }

    checkBorders(){
        if(!this.element.dragging && this.autoPosition){
            var w=this.getWindowWH();
            var p=this.getP1();
            var p4=this.getPoints()[3];
            // if(p.x<0){p.x=0;this.setP1(p);return;}
            // if(p.y<0){p.y=0;this.setP1(p);return;}
            // if(p4.x>w.x){p.x=p.x-(p4.x-w.x);this.setP1(p);return;}
            // if(p4.y>w.y){p.y=p.y-(p4.y-w.y);this.setP1(p);return;}
            var ch=false;
            if(p.x<0){p.x+=2;ch=true;}
            if(p.y<0){p.y+=2;ch=true;}
            if(p4.x>w.x){p.x-=2;ch=true;}
            if(p4.y>w.y){p.y-=2;ch=true;}
            if(ch){
                this.setP1(p,true);
            }
        }
    }
    getWindowWH(){
        return new Vector2( window.innerWidth, window.innerHeight);
    }
}

export class Trail extends Frame{
    constructor(trailHandler) {
        super(trailHandler);
        this.showTitlebuttons=false;
    }
    caseId;
    trailMainClassName='trailMainClass';
    trailCardClassName='trailcardclass';
    trailCardToolTipClassName='trailcardtooltip'
    trailcardHeaderClassname='trailcardHeader';
    trailcardContentClassname='trailcardContentClass';
    trailcardEventItemClassName='trailcardEventItemClass'
    futureClassName='future';
    todayClassName='todaycard';
    trailPointClassName='trailpoint';
    menuClassName='trailMenu';
    menuRadioClassName='trailRadio';
    trailItems;
    filter='all';
    dp=new Vector2(400,800);
    Init(id){
        this.props.id=id;
        this.props.w=400;
        this.props.h=800;
        this.props.label=`Time trail`;
        this.props.pinned=true;
        super.Init();
        this.autoScale=false;
        this.autoPosition=false;
        this.element.classList.add(this.trailMainClassName);
        this.element.title="Scroll or drag";
        
        this.makeMenu();
    }
    makeMenu(){
        var menuBox=this.makeDiv('trailMenu', this.menuClassName, this.element);
        var rbnAll=this.makeRadioDiv("trailAll",this.menuRadioClassName,menuBox,"trailSelection","All" );
        rbnAll.checked=true;
        var rbnDocuments=this.makeRadioDiv("trailDocuments",this.menuRadioClassName,menuBox,"trailSelection","Only documents" );
        rbnAll.addEventListener('click', (e)=>{
            this.checkSelectedFilter(e);
        });
       rbnDocuments.addEventListener('click', (e)=>{
            this.checkSelectedFilter(e);
        });
    }
checkSelectedFilter(e){
    this.filter='all';
    var rbn=e.currentTarget;
    if(rbn.checked && rbn.id=="trailDocuments"){
        this.filter='documents'; 
    }
    this.setTrailByCaseId();

}
    objectComparisonCallback = (arrayItemA, arrayItemB) => {
        if (arrayItemA.date > arrayItemB.date) {
            return -1
        }
    }
    setTrailByCaseId(caseId){
        if(caseId){
            this.caseId=caseId;
        }
        if(!this.caseId){
            return;
        }
        this.setBusy(true);
        this.removeAllChildren(this.contentDiv);

        var trailApiUrl=config.trailApiUrl;
        
            try{
            fetch(`${trailApiUrl}${this.caseId}&filter=${this.filter}`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                }
            })
            .then(response => {
                if (response.status >= 200 && response.status <= 299) {
                return response.json();
                }
                else{
                this.trailHandler.writeError(response.statusText);
                }
            })
            .then(
                json => {
                    var trails = initiateItems( json.trails);
                    json.trails=trails;
                    
                    this.writeResults(json);
                    this.setBusy();

                }
            ).catch((error) => {
                this.trailHandler.writeError(error);
                this.setBusy();
            });
            }
            catch(x){
                this.trailHandler.writeError(x);
                this.setBusy();
            }
        
            function initiateItems(items){
                for (var i = 0; i < items.length; i++) {
                    items[i].date=new Date(items[i].date);
                    items[i].number=i;
                }	
            return	items;		
        }

    }
    writeResults(json){
        this.makeTrail(json.trails);
    }
    makeTrail(items){
        if(items.length==0){

            var noResults=this.makeDiv(null,this.caseSearchItemClassName, this.contentDiv);
            noResults.classList.add(this.noResultsClassName);
            noResults.innerText='-- No results found --';
           
            return;
        }
 
        this.trailItems=items;
        this.trailItems.push(this.gettoday());
        this.trailItems.sort(this.objectComparisonCallback);
//        var n=0;
        var visiblestarted=false;
        this.prevDate=null;
        var maxpos=new Vector2(0,0);
        this.removeAllChildren(this.contentDiv);
        for(var n=0;n<this.trailItems.length;n++){
            var item=this.trailItems[n];
            var pos=this.makeCard(item, n);
            if(!pos.hidden){
                maxpos.x=maxpos.x<pos.x?pos.x:maxpos.x;
                maxpos.y=maxpos.y<pos.y?pos.y:maxpos.y;
                this.setPoints(item, n);
                visiblestarted=true;
            }
            else if(visiblestarted){
                break;
            }
 //           n++;

        }
        this.scaleToContent(maxpos);
        this.initEvents();
        this.element.style.overflow='hidden';
    }
    gettoday(){
        return {
            "id": "today",
            "date": new Date(),
            "label": "Today",
            "type": "today",
            "note":"Add new items"
        }
    }
    scrollcount=0;
    dragDistance=0;
    initEvents(){
        this.element.addEventListener('wheel', (event) => {
            // handle the scroll event 
            event.preventDefault();
            this.scrollcount+=event.deltaY;
            console.log(this.scrollcount);
           this.updateTrailItems(true);
        });
        this.setDragEvents();
    }
    updateTrailItems(handlePoints){
        var n=0;
        this.prevDate=null;
        var points=document.querySelectorAll(`.${this.trailPointClassName}`);
        points.forEach((p)=>{
            p.remove();
        });
        this.trailItems.forEach((item)=>{
            if(item.card){
                this.setCardPositionAndScale(item, n);
                if(handlePoints){
                    this.setPoints(item, n);
                }
                n++;
            }
        });
    }
    prevDate=null;
    setPoints(item, n){
        if(this.prevDate!=null){
            var d=item.date;
            var time_difference = d.getTime() - this.prevDate.getTime();  
            var days_difference = Math.abs( Math.round( time_difference / (1000 * 60 * 60 * 24)));  
            for(var q=0;q<days_difference;q++){
                var no=n- q/days_difference
                var pf=this.getPositionAndTransformFromNumber(no);
                var point=this.makeDiv(null, this.trailPointClassName, this.contentDiv);
                point.style.left=`${pf.pos.x+100}px`;
                point.style.top=`${pf.pos.y}px`;
                point.innerText='_'
            }
        }
        this.prevDate=item.date;

    }
    setDragEvents(){
        var startDrag=0;
        this.contentContainerDiv.addEventListener('pointerdown',(e)=>{
            e = e || window.event;
            e.preventDefault();
            startDrag = e.clientY;
             // call a function whenever the cursor moves:
            //document.onmousemove = elementDrag;
            this.contentContainerDiv.addEventListener('pointermove',(e)=>{
                if(startDrag>0){
                this.dragDistance=-4*(startDrag-e.clientY);
                this.updateTrailItems(false);
            }
            });
            //this.contentContainerDiv
            document.addEventListener('pointerup',(e)=>{
                if(startDrag>0){
                    this.scrollcount+=this.dragDistance;
                    startDrag=0;
                    this.dragDistance=0;
                    this.updateTrailItems(true);
                }
            });

       });

    }
    makeCard(item, n){
        var st=this.getStyleFromDate(item.date,n);
        item.card=this.makeDiv(`item${item.id}`, `${this.trailCardClassName} ${st.futureclass}`, this.contentDiv);
        item.card.style.zIndex=`-${n}`;
        //item.card.title=item.note??'';
        if(item.note){
            if(config.useHtmlToolTips){
                var tooltip=this.makeSpan(null, this.trailCardToolTipClassName, item.card);
                tooltip.innerHTML=item.note;
            }
            else
            {
                item.card.title=item.note;
            }
        }

        this.makeDiv(``, `cardicon ${item.type}`, item.card);
        var t=this.makeDiv(``, this.trailcardHeaderClassname, item.card);
        
        t.innerText=st.dateString;
        t.title=st.dateLongString;
        var tc=this.makeDiv(``, this.trailcardContentClassname, item.card);
        tc.innerText=item.label;
        if(item.type=='today'){
            // var newEventItem=this.makeDiv(``, this.trailcardEventItemClassName, item.card);
            // newEventItem.addEventListener('click',async (o)=>{
            //     var transActionId=this.trailHandler.spUtills.getRandomId();
            //     var ev=await this.trailHandler.spUtills.createEvent(transActionId);
            // });
        }
        else{

       
            tc.addEventListener('click',(o)=>{
                var a=o;
                this.openFrame(item, new Vector2(o.screenX, o.screenY));
            });
        }
        item.dateValue=tc.date;
        item.number=n;
        return this.setCardPositionAndScale(item, n);
    }
    setCardPositionAndScale(item, n){
        var st=this.getStyleFromDate(item.date,n);
        ScreenElement.setPositionByVector(item.card,st.pos);
        item.card.style.transform=`scale(${st.transform})`;
        var cbb=this.getBoundingBox();
        var cardSizeV=ScreenElement.getSize(item.card);
        // if(n==9){
        // 	console.log(st.transform);
        // }
        st.pos.hidden=st.pos.y+cardSizeV.y> cbb.y2+300||st.transform<0.4
        item.card.style.display=st.pos.hidden?'none':'block';
        return st.pos;
    }
    scaleToContent(p){
        var v=p.add(new Vector2(400,400)); 
        var vc=ScreenElement.getSize(this.contentDiv);
        var sx=vc.x/v.x;
        var sy=vc.y/v.y;
        var scale=sx<sy?sx:sy;
        this.contentDiv.style.transform=`scale(${scale})`;

    }
    maxItems=10;
    today=new Date();
    getStyleFromDate(d, no){
        var p={};
        d=d?new Date(d):this.today;
        var pt=this.getPositionAndTransformFromNumber(no);
     
        p.pos=pt.pos;
        p.futureclass=d>this.today?this.futureClassName:``;
        if(this.sameDay(d,this.today)){
            p.futureclass=this.todayClassName;
        }
        p.dateLongString=d.toLocaleString('nl-NL');
        p.dateString=`${this.getDayName(d)} ${d.getDate().toString()}-${(d.getMonth()+1).toString()}-${d.getFullYear().toString()}`;
 
        p.date=d;
        p.transform=pt.f;
        return p;
    }
    getDayName(d){
        var days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

        return days[d.getDay()];
    }
    sameDay(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate();
    }
 
    openFrame(item, v){
       // alert(url);
       this.trailHandler.makeFrameOnClearPosition(item, v);
    }
    getPositionAndTransformFromNumber(no){
        var r=(this.scrollcount+this.dragDistance)/5000+ (this.maxItems-no)/this.maxItems;
        var f=.7+r;
        var rsq=Math.pow( r, 2);
        var pos=new Vector2(0.5*f*r*this.dp.x,  f*rsq*this.dp.y).sub(new Vector2(100,150));
        return {'pos':pos,'f':f}
    }
}

export class ScreenField extends ScreenElement{
    constructor(trailHandler, x,y) {
        super(trailHandler);
        if(x && y){
            this.effectPosition=new Vector2(x,y);
            this.createVisual();
        }
        this.props.pinned=true;
        
    }
    screenPartClassName='screenPartClass';
    effectRadius=200;
    effectScale=3;
    presentingFrame=null;
    maxw=600;
    maxh=720
    createVisual(){

        this.element=this.makeDiv('',this.screenPartClassName, this.assureParent());
        this.element.style.left=`${this.effectPosition.x}px`;
        this.element.style.top=`${this.effectPosition.y}px`;
        this.element.style.width=`${3*this.effectRadius}px`;
        this.element.style.height=`${3*this.effectRadius}px`;
    }
    fieldVector(v){
        var fv=new Vector2(0,0);
        var d=this.effectPosition.sub(v);
        var dl=d.length();
        if(dl>5 && dl<this.effectRadius){
            fv=d.normalize(10);
        }
        return fv;
    }
    handleFrame(f){
        //if(f.autoPosition){
            if(f.getP1 && f.presentStatus!=0){
                var p1=f.getP1();
                var fv=this.fieldVector(p1);
                var le=fv.length();
                if(le>0){
                    if(f.autoScale && f.handleAutoScale){
                        var dist=this.effectPosition.sub(f.getP1()).length()/100;
                        var scale=(1+this.effectScale/(1+Math.pow( dist, 2)));//;*screenScale;
                        f.setScale(scale);
                        var size=ScreenElement.getSize(f.element);
                        if((size.x>this.maxw || size.y>this.maxh) && f.presentStatus==1){
                            f.handleAutoScale=false;
                           
                        }  
                    }
                }
            }
        //}
    }				
}

export class CaseSearch extends Frame{
    constructor(trailHandler, screenField ) {
        super(trailHandler, CaseSearch.getCaseSearchProps(), screenField);
        this.showTitlebuttons=false;
        super.Init();
        this.init();
    }
    trail=null;
    searchResult;
    caseClassName='caseClass';
    caseOwnerClassName='caseOwnerClass';
    
    caseSearchFieldClassName='caseSearchFieldClass';
    caseSearchItemsClassName='caseSearchItemsClass';
    caseSearchItemClassName='caseSearchItemClass';


    caseField;
    caseOwnerField;
    searchField;
    searchItemsField;
    caseApiUrl=config.caseApiUrl;
    
    static getCaseSearchProps(){
        
            var props={};
            props.x=0;
            props.y=0;
            props.w=500;
            props.h=70;
            props.label='Case';
        return props;
    }
    init(){
        this.autoScale=false;
        this.props.pinned=true;
        this.element.style.overflow='hidden';
        //make case field
        this.caseField=this.makeDiv(`case`,this.caseClassName, this.contentDiv);
        this.caseField.innerText='Open a case ...'
        this.caseOwnerField=this.makeDiv(`caseOwner`,this.caseOwnerClassName, this.contentDiv);
        this.caseField.addEventListener('click', ()=>{
            this.caseField.style.display='none';
            this.searchField.style.display='block';
            this.handleSearch(true);
            this.searchField.focus();
        });

        //make searchfield
        this.searchField=this.makeSearch(`caseSearch`,this.caseSearchFieldClassName, this.contentDiv);
        this.searchField.setAttribute('name', 'caseSearch');
        this.searchField.setAttribute('autocomplete', 'off');
        
        this.searchField.addEventListener('search', ()=>{
            this.handleSearch();
        });
        this.searchField.addEventListener('keyup', ()=>{
            this.handleSearch();
        });
        this.searchField.addEventListener('pointerdown',(e)=>{
            e = e || window.event;
            e.preventDefault();
            this.searchField.focus();
        });
        //make searchitems div
        this.searchItemsField=this.makeDiv(`searchItems`,this.caseSearchItemsClassName, this.contentDiv);
    }
    clearSearchItems(){
        this.removeAllChildren(this.searchItemsField);
    }
    searchTimeOut=null;
    handleSearch(ingnoreClear){
        this.hideScreenFieldElement();

        if(!ingnoreClear){
            this.clearSearchItems();
        }
        if(this.searchField.value.length>3){
            this.setBusy(true);
            if(this.searchTimeOut!=null){
                window.clearTimeout(this.searchTimeOut);
            }
            this.searchTimeOut= window.setTimeout(()=>{this.doHandleSearch(this);}, 1000);
        }
    } 
    doHandleSearch(caseSearch){
        try{
            this.setBusy(true);
            fetch(this.caseApiUrl+this.searchField.value, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                }
            })
            .then(response => {
                if (response.status >= 200 && response.status <= 299) {
                return response.json();
                }
                else{
                    caseSearch.trailHandler.writeError(response.statusText);
                }
            })
            .then(
                json => {
                    caseSearch.searchResult=json;
                    caseSearch.writeResults();
                    this.setBusy(false);
                }
            ).catch((error) => {
                caseSearch.trailHandler.writeError(error);
                this.setBusy(false);
            });
            }
            catch(x){
                caseSearch.trailHandler.writeError(x);
                this.setBusy(false);
            }
    }
    hideScreenFieldElement(show){
        if(this.screenField && this.screenField.presentingFrame){
            if(show){
                this.screenField.presentingFrame.element.style.display='block';
            }
            else{
                this.screenField.presentingFrame.element.style.display='none';
            }
        }

    }
    writeResults(){
        this.clearSearchItems();

        if(this.searchResult.cases.length==0){

            var noResults=this.makeDiv(null,this.caseSearchItemClassName, this.searchItemsField);
            noResults.classList.add(this.noResultsClassName);
            noResults.innerText='-- No results found --';
            noResults.addEventListener('click', (o)=>{
                this.clearSearchItems();
                this.caseField.style.display=null;
            });
            return;
        }
        
        this.searchResult.cases.forEach((item)=>{
            var itemDiv=this.makeDiv(`searchItem`,this.caseSearchItemClassName, this.searchItemsField);
            itemDiv.innerHTML=this.highlightmatch(item.name);
            itemDiv.setAttribute('data',item.id);
            itemDiv.addEventListener('click', (o)=>{
                var id=o.target.getAttribute('data');
                var theCase=this.getCaseFromsearchResult(id);
                this.caseField.innerText=`${theCase.code} ${theCase.name}`;
                this.caseOwnerField.innerText=`${theCase.clientCode} ${theCase.client}`;
                this.caseField.style.display=null;
                this.clearSearchItems();
                this.searchField.style.display='none';
                if(this.trail!=null){
                    this.trail.setTrailByCaseId(id);
                }
                this.trailHandler.clearFrames();
                this.hideScreenFieldElement(true);
            });
        });

    }  
    highlightmatch(txt){
        let search_text_value = this.searchField.value;
        search_text_value = search_text_value.replace(/[.*+?^${}()|[]\]/g, '\$&'); //https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
        let regex_object = new RegExp(search_text_value, 'gi');
        txt= txt.replace(regex_object, `<mark>$&</mark>`);
        return txt;
    }
    getCaseFromsearchResult(id){
        if(this.searchResult){
            var result = this.searchResult.cases.filter(obj => {
                return obj.id == id
              });
              if(result.length>0){
                return result[0];
              }
        }
    }  
}

export class Sticker extends Frame{
    constructor(trailHandler, screenField) {
        super(trailHandler, Sticker.getDefaultProps(), screenField);
        super.Init();
        this.init();
    }
    content="";
    contentId=null;
    stickerClassName='stickerClass';
    stickerImageContentClassName='stickerImageContentClass';
    stickerCopiedMessageClassName='stickerCopiedMessageClass';
    textSpan;
    copiedMessage;
    static getDefaultProps(){
        
        var props={};
        props.x=0;
        props.y=0;
        props.w=260;
        props.h=160;
        props.label='Sticker';
        return props;
    }
    init(){
        
        this.copiedMessage=this.makeDiv(null, this.stickerCopiedMessageClassName, this.contentDiv);
        this.copiedMessage.innerText="Content copied to clipboard";
        this.copiedMessage.style.display='None';
       //this.textSpan=this.makeSpan(null, null, textContainerDiv);
         //this.setWidthHeight()
    }
    setImageContent(blob, blobid){
        this.content=blob;
        this.contentId= blobid;             
        var img=this.makeElement('img',null,this.stickerImageContentClassName,this.contentDiv);
        var URLObj = window.URL || window.webkitURL;
        var sourceUrl = URLObj.createObjectURL(blob);

        img.src=sourceUrl;
        img.addEventListener('click', async()=>{
            await navigator.clipboard.write([new ClipboardItem({'image/png': this.content})]);
            this.showCopiedMessage()
        });
    }
    setTextContent(content, isHtml){
        this.content=content;
        this.contentId=content;
        this.textSpan=this.makeDiv(null, this.stickerClassName, this.contentDiv);
        this.textSpan.style.backgroundColor=this.getRandomColor();
        this.textSpan.addEventListener('click', async ()=>{
            await navigator.clipboard.writeText(this.content);
            this.showCopiedMessage()
        });
        if(isHtml){
            this.textSpan.innerHTML= this.content;
        }
        else{
            this.textSpan.innerHTML=this.trailHandler.checkForLinks( this.content);
        }
    }
    showCopiedMessage(){
        this.copiedMessage.style.display='Block';
        window.setTimeout(()=>{this.copiedMessage.style.display='None';},2000);
    }
    getRandomColor(){
        return '#'+(0x1000000+(0.5+Math.random()/2)*0xffffff).toString(16).substr(1,6);
    }
}

export class Clipboard extends Frame{
    constructor(trailHandler, screenField) {
        super(trailHandler, Clipboard.getDefaultProps(), screenField);
        this.showTitlebuttons=false;
        super.Init();
        this.init();
    }
    content="";
    clipboardClassName='clipboardClass'
    textSpan;
    static getDefaultProps(){
        
        var props={};
        props.x=1147;
        props.y=55;
        props.w=92;
        props.h=70;
        props.label='Clipboard stikkers';
        props.pinned=true;
        return props;
    }
    init(){
        this.element.style.overflow='hidden';
        this.element.style.zIndex=-1;
        this.clipDiv=this.makeDiv(null, this.clipboardClassName, this.contentDiv);
        this.clipDiv.title="Click to create a sticker from text or an image copied to the clipboard";
        this.clipDiv.addEventListener('click',  async () =>{
            //const text = await navigator.clipboard.read();//.readText();

            try {
                const clipboardItems = await navigator.clipboard.read();
                for (const clipboardItem of clipboardItems) {
                  for (const type of clipboardItem.types) {
                    if(type=='image/png'){
                        const blob = await clipboardItem.getType(type);
                        this.trailHandler.MakeNewImageSticker(blob, this.getP1());
                        return;
                    }
                    // else if(type=='text/html'){
                    //     const blob = await clipboardItem.getType(type);
                    //     var URLObj = window.URL || window.webkitURL;
                    //     var source = URLObj.createObjectURL(blob);
                    // }
                    else if(type=='text/plain'){
                        const text = await navigator.clipboard.readText();
                        if(text && text.length>0){
                            this.trailHandler.MakeNewSticker(text, this.getP1());
                        }
                        else{
                         }
                        return;
                    }
                  }
                }
              } catch (err) {
                console.error(err.name, err.message);
              }
              this.clipDiv.innerHTML='No supported data found';
              window.setTimeout(()=>{ this.clipDiv.innerHTML='';}, 3000);






        })

    }
}

export class SliderBar extends ScreenElement{
    constructor(trailHandler) {
        super(trailHandler);

        this.createVisual();

        this.props.pinned=true;
        
    }
    sliderBarClassName='sliderBarClass';
    element;
    parent;
    currentScale=1;
    createVisual(){
        this.parent=this.assureParent()
        this.element=this.makeDiv(null,this.sliderBarClassName, this.parent)
        var sb=this.makeElement('input', 'sliderBar', null, this.element);
        sb.type='range';
        sb.min=40;
        sb.max=200;
        sb.value=this.currentScale*100;
        sb.addEventListener('input',(e)=>{
            this.currentScale=e.target.value/100;
            this.parent.style.transform=`scale(${this.currentScale})`;
        });
    }
}

export class Search extends Frame{
    constructor(trailHandler, sreenField) {
        super(trailHandler,Search.getDefaultProps(), sreenField);
        super.Init();
        this.createVisual();

        this.props.pinned=true;
        this.spUtills=new spUtills();
    
    }
    searchFieldPanelClassName='searchFieldPanelClass';
    searchPasteButtonClassName='searchPasteButtonsClass';
    searchClassName='searchClass';
    searchFieldClassName='searchFieldClass';
    searchResultsClassName='searchResultsClass';
    currentScale=100;
    searchItems=[];
    searchField;
    searchResultsCover;
    searchResultsDiv;
    static getDefaultProps(){
        
        var props={};
        props.id='Search'
        props.x=0;
        props.y=0;
        props.w=400;
        props.h=800;
        props.label='Search';
        return props;
    }
    createVisual(){
        this.contentDiv.style.overflow='hidden';
        var searchFieldPanel=this.makeDiv(null, this.searchFieldPanelClassName, this.contentDiv)
        var pasteButton=this.makeDiv('aiSearchPasteButton', this.searchPasteButtonClassName,  searchFieldPanel);
        pasteButton.title="Paste and search";
        pasteButton.addEventListener('click', async ()=>{
            const text = await navigator.clipboard.readText();
            if(text && text.length>0){
                this.searchField.innerText=text;
                this.doAIRequest(this.searchField.innerText);
            }

        });
        this.searchField=this.makeDiv('aisearch', this.searchFieldClassName,  searchFieldPanel);
        this.searchField.setAttribute("contentEditable","true");
        this.searchResultsDiv=this.makeDiv('searchResults', this.searchResultsClassName,  this.contentDiv)
        this.searchField.addEventListener('keydown', (e) => {
            var key = e.key;
            if (key == 'Enter') {
                e.preventDefault();
               
                this.doAIRequest(this.searchField.innerText);
                //return false;
            }
        });
    }
    doAIRequest(searchrequest) {
        this.setBusy(true);
        this.searchResultsDiv.innerHTML='';
        var json = config.searchObject; 
        json.Search=searchrequest;
        var url = config.searchApiUrl;
        var tosend = JSON.stringify(json);
        // request options
        const options = {
            method: 'POST',
            body: tosend,
            headers: {
                'Content-Type': 'application/json'
                }
            }

        fetch(url, options)
            .then(res => res.json())
            .then(res => this.handleResult(res, searchrequest))
            .catch(err => {
                if (err.name != 'AbortError') {
                }
                else {

                }
            });
    }
    makePropsFromSearchResult(searchItem){
        var props={};
        props.id=searchItem.docid;
        props.url=searchItem.url;
        props.siteUrl=searchItem.siteUrl;

        return props;
    }
    handleResult(res, searchrequest) {
        this.searchItems=[];
        var h = ''
        if (res.tot) {
            for (var i = 0; i < res.tot.length; i++) {
                var r = res.tot[i];
                var props=this.makePropsFromSearchResult(r);
                var p = this.addLineBreaks(this.maxPretextLenth(r.txtp, 100));
                var t = this.addLineBreaks(r.txt);
                var a = this.addLineBreaks(r.txta);
                var u = r.url;
                let dateStr = '';
                let dateTimeStr = '';
                if (r.messageDeliveryTime != null) {
                    let date = new Date(r.messageDeliveryTime + "Z");
                    if (date != null) {
                        dateStr = `- ${date.toDateString()}`;//.toLocaleDateString()
                        dateTimeStr = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                        props.date=date;
                        props.note=`Probability ${r.score}`
                    }
                }
                var url = this.spUtills.getOpenUrl(r.url,r.siteUrl, true);
                var ext = this.spUtills.getFileType(r.url);
                var iconcls = this.spUtills.getIconClass(ext);
                var fileName=this.spUtills.getFileName(u);
                props.label=fileName;
                var simtext=this.makeDiv(null, "simtext", this.searchResultsDiv);
                var titlediv=this.makeDiv(null, null, simtext);
                this.makeDiv(null, `icon ${iconcls}`, titlediv);
                this.getImageFromProbability(r.score, titlediv);
                var doclinkContainer = this.makeDiv(null, 'docurl', titlediv);
                doclinkContainer.title="Open document";
                var doclink=this.makeDiv(null, null, doclinkContainer);
                doclinkContainer.innerText=fileName;
                doclinkContainer.setAttribute('data',i);
                this.searchItems.push(props);
                
                doclinkContainer.addEventListener('click', (e)=>{
                    var idx=e.target.getAttribute('data');
                    var item=this.searchItems[idx];
                    this.openFrame(item, new Vector2(e.screenX, e.screenY))
                });

                var dateSpan = this.makeSpan(null, "datestring",doclink);
                dateSpan.innerText = dateStr;
                dateSpan.title=dateTimeStr;

                var pdiv=this.makeDiv(null, "context", simtext); 
                pdiv.innerHTML=p;
                var tdiv=this.makeDiv(null, "foundtext", simtext); 
                tdiv.innerHTML=t;
                var adiv=this.makeDiv(null, "context", simtext); 
                adiv.innerHTML=a;

  


            }

            this.setBusy(false);
            

        }
     }
     addLineBreaks(txt) {
        return txt.split('\n').join(`<div class='breakdiv'></div>`);
    }
    openFrame(item, v){
       this.trailHandler.makeFrameOnClearPosition(item, v);
    }
    maxPretextLenth(txt, le) {
        if (txt && txt.length > le) {
            txt = txt.substring(txt.length - le);
            var sp = txt.indexOf(' ');
            if (sp < 10) {
                txt = txt.substring(sp);
            }
            txt = '... ' + txt;
        }
        return txt;
    }
    getImageFromProbability(num, parent) {
        let imgUrl = 'strength.png';
        let mc = 5;
        let perc = Math.round(num * 100);
        if (perc < 65) {
            imgUrl = 'strength.png';
        }
        else if (perc < 72) {
            imgUrl = 'strength1.png';
        }
        else if (perc < 79) {
            imgUrl = 'strength2.png';
        }
        else if (perc < 86) {
            imgUrl = 'strength3.png';
        }
        else if (perc < 93) {
            imgUrl = 'strength4.png';
        }
        else {
            imgUrl = 'strength5.png';
        }

        var img = this.makeElement('img',null, 'probability', parent);
        img.src=`./images/${imgUrl}`;
        img.title = `Similarity ${perc}%`;
        return img;
        //return `<img class='probability' src='./images/${imgUrl}' title='Similarity ${perc}%' />`;
    }
}

var TrailHandler = function(){
    const self = this;

    var frames=[];
    var screenFields=[];
    this.sliderBar=null;

    this.spUtills=new spUtills();
    this.getFrameById=function(id){
        for(var n=0;n<frames.length;n++){
            if(frames[n].props.id==id){
                return frames[n];
            }
        }
        
    }
    this.removeFrame=function(f){
        var idx=frames.indexOf(f);
        frames.splice(idx,1);
       // frames=frames.filter(fr=>{fr!=f});
        f.element.remove();
    }
    this.clearFrames = function(){
        var farr=[];
        frames.forEach((f)=>{
            if(!f.props || f.props.pinned){
                farr.push(f);
            }
            else{
                if(f.screenField && f.screenField.presentingFrame==f){
                    f.screenField.presentingFrame=null;
                }
                f.element.remove();
            }
        });
        frames=farr;
    }
    this.checkForLinks = function(txt){
        //search_text_value = search_text_value.replace(/[.*+?^${}()|[]\]/g, '\$&'); 
        var re = /(http|https|ftp|dict)(:\/\/\S+?)(\,?\s|\.?\s|\.?$)/gi;

        txt= txt.replace(re, '<a target=\'_blank\' href=\'$1$2\'>$1$2<\/a>$3');
        return txt;
    }
 //   var defaultScreenField;
    this.initiateScreen= function(){
        var w=self.getWindowWH();
        const frameDist=5; //border between frames
        var pp=new Vector2(w.w/3, w.h/20) //get position of caseSearch
        self.sliderBar=new SliderBar(this);
        var sliderBarSize=ScreenElement.getSize(self.sliderBar.element);
        var sliderBarX=w.w/2-sliderBarSize/2;
        self.sliderBar.setP1(new Vector2(sliderBarX,10));
        frames.push(self.sliderBar);

        
        var trail=new Trail(this);
        trail.Init('myTrail');
        var trailSize= ScreenElement.getSize( trail.element);
        var trailPosition=new Vector2(pp.x-trailSize.x-frameDist, pp.y) //position of trail
        trail.setP1(trailPosition);
        frames.push(trail);

        var tempy=135; //temporary, should be based on height caseSearch
        this.defaultScreenField=new ScreenField(this, pp.x, tempy);
        this.defaultScreenField.effectScale=2;
        screenFields.push(this.defaultScreenField);
        frames.push(this.defaultScreenField);

        var caseSearch=new CaseSearch(this, this.defaultScreenField);
        caseSearch.setP1(new Vector2(pp.x,pp.y));
        caseSearch.trail=trail;
        frames.push(caseSearch);

        var caseSearchSize=ScreenElement.getSize( caseSearch.element);
        var screenFieldPosition=new Vector2(pp.x, pp.y+caseSearchSize.y+frameDist);
        this.defaultScreenField.setP1(screenFieldPosition);
        this.defaultScreenField.effectPosition=screenFieldPosition;

        var clipboardPosition=new Vector2(pp.x+caseSearchSize.x+frameDist, pp.y);
        var screenFieldSize=ScreenElement.getSize(this.defaultScreenField.element);

        var clipboardSize=new Vector2(screenFieldSize.x-(caseSearchSize.x+frameDist),caseSearchSize.y) ;
 
        var clipboard=new Clipboard(this, this.defaultScreenField);
        clipboard.setP1(clipboardPosition);
        ScreenElement.setSizeByVector(clipboard.element, clipboardSize)
        frames.push(clipboard);

        if(config.searchApiUrl){
            var search=new Search(this, this.defaultScreenField);
            var searchSize=ScreenElement.getSize(search.element);
            var searchPosition=new Vector2(clipboardSize.x+clipboardPosition.x+150,pp.y);//w.w -(searchSize.x+ frameDist)

            search.setP1(searchPosition);
            frames.push(search);
        }
        window.setInterval(updateTimeFrame, 20);
    }
    this.prepareSticker=function(startPosition){
        var sticker=new Sticker(this, this.defaultScreenField);
        this.drawOnClearPosition(sticker);
        var target=sticker.getP1();
        if(startPosition){
            sticker.setP1(startPosition);
            sticker.presentStatus=2;
        }
         sticker.target=target;
        frames.push(sticker);
        return sticker;

    }
    this.MakeNewSticker=function(text, startPosition){
        var fn=this.findExistingSticker(text);
        if(fn){
            fn.highlight(true);
            return;
        }
        var sticker=this.prepareSticker(startPosition);
        sticker.setTextContent(text);
    }
    this.MakeNewImageSticker= async (blob, startPosition) =>{
        var blobId=await this.convertBlobToBase64(blob);
        var fn=this.findExistingSticker(blobId);
        if(fn){
            fn.highlight(true);
            return;
        }
      

        var sticker=this.prepareSticker(startPosition);
        sticker.setImageContent(blob, blobId);
    }
    this.makeFrameOnClearPosition=function(props, startPosition){
        var fn=this.findExisting(props);
        if(fn){
            fn.highlight(true);
            return;
        }
        var url=props.url;
        props.url=this.spUtills.getOpenUrl(url, props.siteUrl, true);
        props.editurl=this.spUtills.getOpenUrl(url, props.siteUrl, false);
        var nf=new Frame(this, props, this.defaultScreenField);
            nf.Init();
            
            frames.push(nf);
            this.drawOnClearPosition(nf);
            var target=nf.getP1();
            if(startPosition){
                nf.setP1(startPosition);
            }
    
            if(this.defaultScreenField.presentingFrame==null){
                nf.present();
            }
            else{
                nf.presentStatus=2;
                nf.target=target;
            }
    }
    this.findExistingSticker= function(contentId){
        var fn=frames.find(f1=>
            f1.contentId==contentId
        );
        return fn;
    }

    this.findExisting= function(f){
        var fn=frames.find(f1=>
            f1.props && f1.props.id==f.id
        );
        return fn;
    }

    this.convertBlobToBase64 = async (blob) => { // blob data
        return await blobToBase64(blob);
      }
      
      const blobToBase64 = blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });



    this.drawOnClearPosition = function(f1){
        var notfound=true;
        var w=self.getWindowWH();
        var q=0;
        var scale=this.sliderBar?this.sliderBar.currentScale:1;
        var offsetX=0.5*w.w/scale -0.5*w.w;
        var screenv=new Vector2(w.w/scale, w.h/scale);
         
        while(notfound){
            if((!f1.props.x ||!f1.props.y)||q>0||(f1.props.x==0 && f1.props.y==0)){
                f1.props.x = Math.random()*screenv.x-offsetX;
                f1.props.y = Math.random()*screenv.y;
                f1.setP1(new Vector2(f1.props.x, f1.props.y))
                //return;
            }
            if(f1.props.x+f1.props.w<screenv.x && f1.props.y+f1.props.h<screenv.y){
                var overlap=false;
                for(var n=0;n<frames.length;n++){
                    var f2=frames[n];
                    if(f1!=f2 && f2.props && f2.props.visible && (Frame.overlaps(f1,f2)|| Frame.overlaps(f2,f1))){
                        overlap=true;
                    }
                }
                if(!overlap){
                    f1.savePosition();
                    return;
                }
            }
            q++;
            if(q>50){
                return;
            }

        }

    }

    this.getWindowWH = function(){
        return {
            'w': window.innerWidth,
            'h': window.innerHeight
        }
    }

    var lastPresented=null
    async function updateTimeFrame(){
        frames.forEach((f1)=>{
            // if(f1.props.visible){
            //     frames.forEach((f2)=>{
            //         if(f1.props.id!=f2.props.id && f2.props.visible){
            //             Frame.checkOverlap(f1,f2);
            //         }
            //     });
            // }
           /// f1.checkBorders();
            screenFields.forEach((sf)=>{
                sf.handleFrame(f1);
           });
           if(f1.checkPresent){
            var tLastPresented=f1.checkPresent(lastPresented);
            if(tLastPresented!=null){
                lastPresented=tLastPresented;
            }
            }
        });

    }
    // function setPresent(obj){
    //     checkObjectUpdateArray(obj);
    //     obj.presentProp = {};
    //     obj.presentProp.speed = speed;
    //     obj.presentProp.defaultPosition = obj.getP1();
    //     obj.presentProp.isPresenting = false;
    //     obj.presentProp.isRunning = false;
    //     var f = function () {
    //         if (obj.presentProp.isRunning) {}
    //     }
    //     obj.updateArray.push(f);
    //     obj.present = function (doPresent) {
   
    //         obj.presentProp.isPresenting = doPresent;
    //         obj.presentProp.isRunning = true;
    //     }

    // }
    // function checkObjectUpdateArray(obj) {
	// 	if (!obj.updateArray) {
	// 		obj.updateArray = [];
	// 		obj.update = function (delta) {
	// 			for (var n = 0; n < obj.updateArray.length; n++) {
	// 				obj.updateArray[n].call(obj, delta);
	// 			}
	// 		}
	// 	}
	// }
    this.writeError =function(m){
        console.log(m)
    }

}
export {TrailHandler}