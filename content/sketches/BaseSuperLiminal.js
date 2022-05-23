let fbo1, fbo2;
let cam1, cam2;
let target = 300;
let length = 1200;
let platesize = 200;
let boxes;
let box_key;
let fovy;
const SPEED = 5;
class EasyCam {

    /**
     * @constructor
     */
    constructor(renderer, args) {
      
  
      // WEBGL renderer required
      if(!(renderer instanceof p5.RendererGL)){
        console.log("renderer needs to be an instance of p5.RendererGL");
        return;
      }
      var bounds = renderer.elt.getBoundingClientRect();
      
      // define default args
      args = args || {};
      if(args.distance === undefined) args.distance  = 500;
      if(args.center   === undefined) args.center    = [0, 0, 0];
      if(args.rotation === undefined) args.rotation  = Rotation.identity();
      if(args.viewport === undefined) args.viewport  = [0, 0, renderer.width, renderer.height];
      if(args.offset   === undefined) args.offset    = [bounds.x + window.scrollX, bounds.y + window.scrollY];
  
      // library info
      this.INFO = INFO;
  
      // set renderer, graphics, p5
      // this.renderer;
      // this.graphics;
      // this.P5
      this.setCanvas(renderer);
  
      // self reference
      var cam = this;
      this.cam = cam;
      
      // some constants
      this.LOOK = [0, 0, 1];
      this.UP   = [0, 1, 0];
  
      // principal axes flags
      this.AXIS = new function() {
        this.YAW   = 0x01;
        this.PITCH = 0x02;
        this.ROLL  = 0x04;
        this.ALL   = this.YAW | this.PITCH | this.ROLL;
      };
    
      // mouse action constraints
      this.SHIFT_CONSTRAINT = 0; // applied when pressing the shift key
      this.FIXED_CONSTRAINT = 0; // applied, when set by user and SHIFT_CONSTRAINT is 0
      this.DRAG_CONSTRAINT  = 0; // depending on SHIFT_CONSTRAINT and FIXED_CONSTRAINT, default is ALL
      
      // mouse action speed
      this.scale_rotation  = 0.001;
      this.scale_pan       = 0.0002;
      this.scale_zoom      = 0.001;
      this.scale_zoomwheel = 20.0;
      
      // zoom limits
      this.distance_min_limit = 0.01;
      this.distance_min       = 1.0;
      this.distance_max       = Number.MAX_VALUE;
      
      // main state
      this.state = {
        distance : args.distance,         // scalar
        center   : args.center.slice(),   // vec3
        rotation : args.rotation.slice(), // quaternion
        
        copy : function(dst){
          dst = dst || {};
          dst.distance = this.distance;      
          dst.center   = this.center.slice(); 
          dst.rotation = this.rotation.slice();
          return dst;
        },
      };
  
      // backup-state at start
      this.state_reset  = this.state.copy();
      // backup-state, probably not required
      this.state_pushed = this.state.copy();
      
      // viewport for the mouse-pointer [x,y,w,h]
      this.viewport = args.viewport.slice();
      
      // offset of the canvas in the container
      this.offset = args.offset.slice();
      
      // add a handler for window resizing
      window.addEventListener('resize', function (e){
        let p = renderer.elt.getBoundingClientRect();
        cam.offset = [p.x + window.scrollX, p.y + window.scrollY];
      });
      
      // mouse/touch/key action handler
      this.mouse = {
        
        cam : cam,
        
        curr   : [0,0,0],
        prev   : [0,0,0],
        dist   : [0,0,0],
        mwheel : 0,
        
        isPressed   : false, // true if (istouchdown || ismousedown)
        istouchdown : false, // true, if input came from a touch
        ismousedown : false, // true, if input came from a mouse
        
        BUTTON : {  LMB:0x01, MMB:0x02, RMB:0x04  },
        
        button : 0,
       
        mouseDragLeft   : cam.mouseDragRotate.bind(cam),
        mouseDragCenter : cam.mouseDragPan   .bind(cam),
        mouseDragRight  : cam.mouseDragZoom  .bind(cam),
        mouseWheelAction: cam.mouseWheelZoom .bind(cam),
        
        touchmoveSingle : cam.mouseDragRotate.bind(cam),
        touchmoveMulti  : function(){
                            cam.mouseDragPan();
                            cam.mouseDragZoom();
                          },
       
        
        insideViewport : function(x, y){
          var x0 = cam.viewport[0], x1 = x0 + cam.viewport[2];
          var y0 = cam.viewport[1], y1 = y0 + cam.viewport[3];
          return (x > x0) && (x < x1) && (y > y0) && (y < y1);
        },
        
        solveConstraint : function(){
          var dx = this.dist[0];
          var dy = this.dist[1];
          
          // YAW, PITCH
          if (this.shiftKey && !cam.SHIFT_CONSTRAINT && Math.abs(dx - dy) > 1) {
            cam.SHIFT_CONSTRAINT = Math.abs(dx) > Math.abs(dy) ? cam.AXIS.YAW : cam.AXIS.PITCH;
          }
          
          // define constraint by increasing priority
          cam.DRAG_CONSTRAINT = cam.AXIS.ALL;
          if(cam.FIXED_CONSTRAINT) cam.DRAG_CONSTRAINT = cam.FIXED_CONSTRAINT;
          if(cam.SHIFT_CONSTRAINT) cam.DRAG_CONSTRAINT = cam.SHIFT_CONSTRAINT;
        },
  
        updateInput : function(x,y,z){
          var mouse = cam.mouse;
          var pd = cam.P5.pixelDensity();
          
          mouse.prev[0] = mouse.curr[0];
          mouse.prev[1] = mouse.curr[1];
          mouse.prev[2] = mouse.curr[2];
          
          mouse.curr[0] = x;
          mouse.curr[1] = y;
          mouse.curr[2] = z;
          
          mouse.dist[0] = -(mouse.curr[0] - mouse.prev[0]) / pd;
          mouse.dist[1] = -(mouse.curr[1] - mouse.prev[1]) / pd;
          mouse.dist[2] = -(mouse.curr[2] - mouse.prev[2]) / pd;
        },
  
        
        
        //////////////////////////////////////////////////////////////////////////
        // mouseinput
        //////////////////////////////////////////////////////////////////////////
  
        mousedown : function(event){
          var mouse = cam.mouse;
          // Account for canvas shift:
          var offX = cam.offset[0] - window.scrollX,
              offY = cam.offset[1] - window.scrollY;
          
          if(event.button === 0) mouse.button |= mouse.BUTTON.LMB;
          if(event.button === 1) mouse.button |= mouse.BUTTON.MMB;
          if(event.button === 2) mouse.button |= mouse.BUTTON.RMB;
          
          if(mouse.insideViewport(event.x - offX, event.y - offY)){
            mouse.updateInput(event.x - offX, event.y - offY, event.y - offY);
            mouse.ismousedown = mouse.button > 0;
            mouse.isPressed   = mouse.ismousedown;
            cam.SHIFT_CONSTRAINT = 0;
          } 
        },
        
        mousedrag : function(){
          var pd = cam.P5.pixelDensity();
          
          var mouse = cam.mouse;
          if(mouse.ismousedown){
            
            var x = cam.P5.mouseX;
            var y = cam.P5.mouseY;
            var z = y;
            
            mouse.updateInput(x, y, z);
            mouse.solveConstraint();
            
            var LMB = mouse.button & mouse.BUTTON.LMB;
            var MMB = mouse.button & mouse.BUTTON.MMB;
            var RMB = mouse.button & mouse.BUTTON.RMB;
            
            if(LMB && mouse.mouseDragLeft  ) mouse.mouseDragLeft();
            if(MMB && mouse.mouseDragCenter) mouse.mouseDragCenter();
            if(RMB && mouse.mouseDragRight ) mouse.mouseDragRight();
          }
        },
        
        mouseup : function(event){
          var mouse = cam.mouse;
          
          if(event.button === 0) mouse.button &= ~mouse.BUTTON.LMB;
          if(event.button === 1) mouse.button &= ~mouse.BUTTON.MMB;
          if(event.button === 2) mouse.button &= ~mouse.BUTTON.RMB;
          
          mouse.ismousedown = mouse.button > 0;
          mouse.isPressed = (mouse.istouchdown || mouse.ismousedown);
          cam.SHIFT_CONSTRAINT = 0;
        },
        
        dblclick : function(event){
          // Account for canvas shift:
          var offX = cam.offset[0] - window.scrollX,
              offY = cam.offset[1] - window.scrollY;
  
          if(cam.mouse.insideViewport(event.x - offX, event.y - offY)){
            cam.reset();
          }
        },
        
        wheel : function(event){
          var x = event.x;
          var y = event.y;
          var mouse = cam.mouse;
          if(mouse.insideViewport(x, y)){
            mouse.mwheel = event.deltaY * 0.01;
            if(mouse.mouseWheelAction) mouse.mouseWheelAction();
          }
        },
        
        
        
        //////////////////////////////////////////////////////////////////////////
        // touchinput
        //////////////////////////////////////////////////////////////////////////
        
        evaluateTouches : function(event){
          var touches = event.touches;
          var avg_x = 0.0;
          var avg_y = 0.0;
          var avg_d = 0.0;
          var i, dx, dy, count = touches.length;
          // Account for canvas shift:
          var offX = cam.offset[0] - window.scrollX,
              offY = cam.offset[1] - window.scrollY;
  
          // center, averaged touch position
          for(i = 0; i < count; i++){
            avg_x += touches[i].clientX - offX;
            avg_y += touches[i].clientY - offY;
          }
          avg_x /= count;
          avg_y /= count;
          
          // offset, mean distance to center
          for(i = 0; i < count; i++){
            dx = avg_x - (touches[i].clientX - offX);
            dy = avg_y - (touches[i].clientY - offY);
            avg_d += Math.sqrt(dx*dx + dy*dy);
          }
          avg_d /= count;
          
          cam.mouse.updateInput(avg_x, avg_y, -avg_d);
        },
        
  
        touchstart : function(event){
          event.preventDefault();
              event.stopPropagation();
          
          var mouse = cam.mouse;
          
          mouse.evaluateTouches(event);
          mouse.istouchdown = mouse.insideViewport(mouse.curr[0], mouse.curr[1]);
          mouse.isPressed = (cam.mouse.istouchdown || cam.mouse.ismousedown);
      
          mouse.dbltap(event);
        },
        
        touchmove : function(event){
          event.preventDefault();
              event.stopPropagation();
          
          var mouse = cam.mouse;
          
          if(mouse.istouchdown){
            
            mouse.evaluateTouches(event);  
            mouse.solveConstraint();
  
            if(event.touches.length === 1){
              mouse.touchmoveSingle();
            } else {
              mouse.touchmoveMulti();
              mouse.tapcount = 0;
            }
          }
        },
        
        touchend : function(event){
          event.preventDefault();
              event.stopPropagation();
          
          var mouse = cam.mouse;
  
          mouse.istouchdown = false,
          mouse.isPressed = (mouse.istouchdown || mouse.ismousedown);
          cam.SHIFT_CONSTRAINT = 0;
          
          if(mouse.tapcount >= 2){
            if(mouse.insideViewport(mouse.curr[0], mouse.curr[1])){
              cam.reset();
            }
            mouse.tapcount = 0;
          }
        },
  
        
        tapcount : 0,
         
        dbltap : function(event) {
          if(cam.mouse.tapcount++ == 0) {
            setTimeout( function() { 
              cam.mouse.tapcount = 0; 
            }, 350 );
          } 
        },
        
        
        
        //////////////////////////////////////////////////////////////////////////
        // keyingput
        //////////////////////////////////////////////////////////////////////////
        
        // key-event for shift constraints
        shiftKey : false,
     
        keydown : function(event){
          var mouse = cam.mouse;
          if(!mouse.shiftKey){
            mouse.shiftKey   = (event.keyCode === 16);
          }
        },
        
        keyup : function(event){
          var mouse = cam.mouse;
          if(mouse.shiftKey){
            mouse.shiftKey = (event.keyCode !== 16);
            if(!mouse.shiftKey){
              cam.SHIFT_CONSTRAINT = 0;
            }
          }
        }
        
      };
      
      
      
      // camera mouse listeners
      this.attachMouseListeners();
     
      // P5 registered callbacks, TODO unregister on dispose
      this.auto_update = true;
      this.P5.registerMethod('pre', function(){
        if(cam.auto_update){
          cam.update(); 
        }
      });
   
      // damped camera transition
      this.dampedZoom = new DampedAction(function(d){ cam.zoom   (d * cam.getZoomMult    ()); }  );
      this.dampedPanX = new DampedAction(function(d){ cam.panX   (d * cam.getPanMult     ()); }  );
      this.dampedPanY = new DampedAction(function(d){ cam.panY   (d * cam.getPanMult     ()); }  );
      this.dampedRotX = new DampedAction(function(d){ cam.rotateX(d * cam.getRotationMult()); }  );
      this.dampedRotY = new DampedAction(function(d){ cam.rotateY(d * cam.getRotationMult()); }  );
      this.dampedRotZ = new DampedAction(function(d){ cam.rotateZ(d * cam.getRotationMult()); }  );
      
      // interpolated camera transition
      this.timedRot  = new Interpolation(cam.setInterpolatedRotation.bind(cam));
      this.timedPan  = new Interpolation(cam.setInterpolatedCenter  .bind(cam));
      this.timedzoom = new Interpolation(cam.setInterpolatedDistance.bind(cam));
    }
    
    
  
    /**
     * sets the WEBGL renderer the camera is working on
     *
     * @param {p5.RendererGL} renderer ... p5 WEBGL renderer
     */
    setCanvas(renderer){
      if(renderer instanceof p5.RendererGL){
        // p5js seems to be not very clear about this
        // ... a bit confusing, so i guess this could change in future releases
        this.renderer = renderer;
        if(renderer._pInst instanceof p5){
          this.graphics = renderer;
        } else {
          this.graphics = renderer._pInst;
        }
        this.P5 = this.graphics._pInst;
      } else {
        this.graphics = undefined;
        this.renderer = undefined;
      }
    }
  
    /** @return {p5.RendererGL} the currently used renderer */
    getCanvas(){
      return this.renderer;
    }
    
    
    attachListener(el, ev, fx, op){
      if(!el || (el === fx.el)){
        return;
      }
      
      this.detachListener(fx);
  
      fx.el = el;
      fx.ev = ev;
      fx.op = op;
      fx.el.addEventListener(fx.ev, fx, fx.op);
    }
    
    detachListener(fx){
      if(fx.el) {
        fx.el.removeEventListener(fx.ev, fx, fx.op);
        fx.el = undefined;
      }
    }
    
    /** attaches input-listeners (mouse, touch, key) to the used renderer */
    attachMouseListeners(renderer){
      var cam = this.cam;
      var mouse = cam.mouse;
      
      renderer = renderer || cam.renderer;
      if(renderer){
        
        var op = { passive:false };
        var el = renderer.elt;
        
        cam.attachListener(el    , 'mousedown' , mouse.mousedown , op);
        cam.attachListener(el    , 'mouseup'   , mouse.mouseup   , op);
        cam.attachListener(el    , 'dblclick'  , mouse.dblclick  , op);
        cam.attachListener(el    , 'wheel'     , mouse.wheel     , op);
        cam.attachListener(el    , 'touchstart', mouse.touchstart, op);
        cam.attachListener(el    , 'touchend'  , mouse.touchend  , op);
        cam.attachListener(el    , 'touchmove' , mouse.touchmove , op);
        cam.attachListener(window, 'keydown'   , mouse.keydown   , op);
        cam.attachListener(window, 'keyup'     , mouse.keyup     , op);
      }
    }
    
    /** detaches all attached input-listeners */
    removeMouseListeners(){
      var cam = this.cam;
      var mouse = cam.mouse;
         
      cam.detachListener(mouse.mousedown );
      cam.detachListener(mouse.mouseup   );
      cam.detachListener(mouse.dblclick  );
      cam.detachListener(mouse.wheel     );
      cam.detachListener(mouse.keydown   );
      cam.detachListener(mouse.keyup     );
      cam.detachListener(mouse.touchstart);
      cam.detachListener(mouse.touchend  );
      cam.detachListener(mouse.touchmove );
    }
    
    /** Disposes/releases the camera. */
    dispose(){
      // TODO: p5 unregister 'pre', ... not available in 0.5.16
      removeMouseListeners();
    }
    
    /** @return {boolean} the current autoUpdate state */
    getAutoUpdate(){
      return this.auto_update;
    }
    /** 
     * If true, the EasyCam will update automatically in a pre-draw step.
     * This updates the camera state and updates the renderers 
     * modelview/camera matrix.
     *
     * If false, the update() needs to be called manually.
     *
     * @param {boolean} the new autoUpdate state 
     */
    setAutoUpdate(status){
      this.auto_update = status;
    }
    
  
    /** 
     * Updates the camera state (interpolated / damped animations) and updates
     * the renderers' modelview/camera matrix.
     *
     * if "auto_update" is true, this is called automatically in a pre-draw call.
     */
    update(){
      var cam = this.cam;
      var mouse = cam.mouse;
      
      mouse.mousedrag();
  
      var b_update = false;
      b_update |= cam.dampedZoom.update();
      b_update |= cam.dampedPanX.update();
      b_update |= cam.dampedPanY.update();
      b_update |= cam.dampedRotX.update();
      b_update |= cam.dampedRotY.update();
      b_update |= cam.dampedRotZ.update();
      
      // interpolated actions have lower priority then damped actions
      if(b_update){
        cam.timedRot .stop();
        cam.timedPan .stop();
        cam.timedzoom.stop();
      } else {
        cam.timedRot .update();
        cam.timedPan .update();
        cam.timedzoom.update();
      }
   
      cam.apply();
    }
    
    /** 
     * Applies the current camera state to the renderers' modelview/camera matrix.
     * If no argument is given, then the cameras currently set renderer is used.
     */
    apply(renderer) { 
  
      var cam = this.cam;
      renderer = renderer || cam.renderer;
      
      if(renderer){
        this.camEYE = this.getPosition(this.camEYE);   
        this.camLAT = this.getCenter  (this.camLAT);
        this.camRUP = this.getUpVector(this.camRUP);
        
        if(undefined===renderer._curCamera)
          renderer.camera(this.camEYE[0], this.camEYE[1], this.camEYE[2],
                          this.camLAT[0], this.camLAT[1], this.camLAT[2],
                          this.camRUP[0], this.camRUP[1], this.camRUP[2]);
        else
          renderer._curCamera.camera(this.camEYE[0], this.camEYE[1], this.camEYE[2],
                          this.camLAT[0], this.camLAT[1], this.camLAT[2],
                          this.camRUP[0], this.camRUP[1], this.camRUP[2]);
      }
  
    }
    
  
    /** @param {int[]} the new viewport-def, as [x,y,w,h] */
    setViewport(viewport){
      this.viewport = viewport.slice();
    }
    
    /** @returns {int[]} the current viewport-def, as [x,y,w,h] */
    getViewport(){
      return this.viewport;
    }
    
    
  
    //
    // mouse state changes
    //
    
    /** implemented zoom-cb for mouswheel handler.*/
    mouseWheelZoom() {
      var cam = this;
      var mouse = cam.mouse;
      cam.dampedZoom.addForce(mouse.mwheel * cam.scale_zoomwheel);
    }
    
    /** implemented zoom-cb for mousedrag/touch handler.*/
    mouseDragZoom() {
      var cam = this;
      var mouse = cam.mouse;
      cam.dampedZoom.addForce(-mouse.dist[2]);
    }
    
    /** implemented pan-cb for mousedrag/touch handler.*/
    mouseDragPan() {
      var cam = this;
      var mouse = cam.mouse;
  
      cam.dampedPanX.addForce((cam.DRAG_CONSTRAINT & cam.AXIS.YAW  ) ? mouse.dist[0] : 0);
      cam.dampedPanY.addForce((cam.DRAG_CONSTRAINT & cam.AXIS.PITCH) ? mouse.dist[1] : 0);
    }
    
    /** implemented rotate-cb for mousedrag/touch handler.*/
    mouseDragRotate() {
      var cam = this;
      var mouse = cam.mouse;
      
      var mx = mouse.curr[0], my = mouse.curr[1];
      var dx = mouse.dist[0], dy = mouse.dist[1];
  
      // mouse [-1, +1]
      var mxNdc = Math.min(Math.max((mx - cam.viewport[0]) / cam.viewport[2], 0), 1) * 2 - 1;
      var myNdc = Math.min(Math.max((my - cam.viewport[1]) / cam.viewport[3], 0), 1) * 2 - 1;
  
      if (cam.DRAG_CONSTRAINT & cam.AXIS.YAW) {
        cam.dampedRotY.addForce(+dx * (1.0 - myNdc * myNdc));
      }
      if (cam.DRAG_CONSTRAINT & cam.AXIS.PITCH) {
        cam.dampedRotX.addForce(-dy * (1.0 - mxNdc * mxNdc));
      }
      if (cam.DRAG_CONSTRAINT & cam.AXIS.ROLL) {
        cam.dampedRotZ.addForce(-dx * myNdc);
        cam.dampedRotZ.addForce(+dy * mxNdc);
      }
    }
    
    
    
    //
    // damped multipliers
    //
    /** (private) returns the used zoom -multiplier for damped actions. */
    getZoomMult(){
      return this.state.distance * this.scale_zoom;
    }
    /** (private) returns the used pan-multiplier for damped actions. */
    getPanMult(){
      return this.state.distance * this.scale_pan;
    }
    /** (private) returns the used rotate-multiplier for damped actions. */
    getRotationMult(){
      return Math.pow(Math.log10(1 + this.state.distance), 0.5) * this.scale_rotation;
    }
    
    
    
    //
    // damped state changes
    //
    /** Applies a change to the current zoom.  */
    zoom(dz){
      var cam = this.cam;
      var distance_tmp = cam.state.distance + dz;
      
      // check lower bound
      if(distance_tmp < cam.distance_min) {
        distance_tmp = cam.distance_min;
        cam.dampedZoom.stop();
      }
      
      // check upper bound
      if(distance_tmp > cam.distance_max) {
        distance_tmp = cam.distance_max;
        cam.dampedZoom.stop();
      }
      
      cam.state.distance = distance_tmp;
    }
    
    /** Applies a change to the current pan-xValue.  */
    panX(dx) {
      var state = this.cam.state;
      if(dx) {
        var val = Rotation.applyToVec3(state.rotation, [dx, 0, 0]);
        Vec3.add(state.center, val, state.center);
      }
    }
    
    /** Applies a change to the current pan-yValue.  */
    panY(dy) {
      var state = this.cam.state;
      if(dy) {
        var val = Rotation.applyToVec3(state.rotation, [0, dy, 0]);
        Vec3.add(state.center, val, state.center);
      }
    }
    
    /** Applies a change to the current pan-value.  */
    pan(dx, dy) {
      this.cam.panX(dx);
      this.cam.panY(dx);
    }
    
    /** Applies a change to the current xRotation.  */
    rotateX(rx) {
     this.cam.rotate([1,0,0], rx);
    }
    
    /** Applies a change to the current yRotation.  */
    rotateY(ry) {
      this.cam.rotate([0,1,0], ry);
    }
    
    /** Applies a change to the current zRotation.  */
    rotateZ(rz) {
      this.cam.rotate([0,0,1], rz);
    }
    
    /** Applies a change to the current rotation, using the given axis/angle.  */
    rotate(axis, angle) {
      var state = this.cam.state;
      if(angle) {
        var new_rotation = Rotation.create({axis:axis, angle:angle});
        Rotation.applyToRotation(state.rotation, new_rotation, state.rotation);
      }
    }
    
    
    
  
    // 
    // interpolated states
    //
    /** Sets the new camera-distance, interpolated (t) between given A and B. */
    setInterpolatedDistance(valA, valB, t) {
      this.cam.state.distance = Scalar.mix(valA, valB, Scalar.smoothstep(t));
    }
    /** Sets the new camera-center, interpolated (t) between given A and B. */
    setInterpolatedCenter(valA, valB, t) {
      this.cam.state.center = Vec3.mix(valA, valB, Scalar.smoothstep(t));
    }
    /** Sets the new camera-rotation, interpolated (t) between given A and B. */
    setInterpolatedRotation(valA, valB, t) {
      this.cam.state.rotation = Rotation.slerp(valA, valB, t);
    }
    
    
    
    //
    // DISTANCE
    //
    /** Sets the minimum camera distance. */
    setDistanceMin(distance_min) {
      this.distance_min = Math.max(distance_min, this.distance_min_limit);
      this.zoom(0); // update, to ensure new minimum
    }
    
    /** Sets the maximum camera distance. */
    setDistanceMax(distance_max) {
      this.distance_max = distance_max;
      this.zoom(0); // update, to ensure new maximum
    }
    
    /** 
     * Sets the new camera distance.
     *
     * @param {double} new distance.
     * @param {long} animation time in millis.
     */
    setDistance(distance, duration) {
      this.timedzoom.start(this.state.distance, distance, duration, [this.dampedZoom]);
    }
    
    /** @returns {double} the current camera distance. */
    getDistance() {
      return this.state.distance;
    }
    
    
    
    //
    // CENTER / LOOK AT
    //
    /** 
     * Sets the new camera center.
     *
     * @param {double[]} new center.
     * @param {long} animation time in millis.
     */
    setCenter(center, duration) {
      this.timedPan.start(this.state.center, center, duration, [this.dampedPanX, this.dampedPanY]);
    }
    
    /** @returns {double[]} the current camera center. */
    getCenter() {
      return this.state.center;
    }
    
    
    
    //
    // ROTATION
    //
    /** 
     * Sets the new camera rotation (quaternion).
     *
     * @param {double[]} new rotation as quat[q0,q1,q2,q3].
     * @param {long} animation time in millis.
     */
    setRotation(rotation, duration) {
      this.timedRot.start(this.state.rotation, rotation, duration, [this.dampedRotX, this.dampedRotY, this.dampedRotZ]);
    }
    
    /** @returns {double[]} the current camera rotation as quat[q0,q1,q2,q3]. */
    getRotation() {
      return this.state.rotation;
    }
    
  
  
    //
    // CAMERA POSITION/EYE
    //
    /** @returns {double[]} the current camera position, aka. the eye position. */
    getPosition(dst) {
  
      var cam = this.cam;
      var state = cam.state;
      
      dst = Vec3.assert(dst);
      Rotation.applyToVec3(state.rotation, cam.LOOK, dst);
      Vec3.mult(dst, state.distance, dst);
      Vec3.add(dst, state.center, dst);
  
      return dst;
    }
  
    //
    // CAMERA UP
    //
    /** @returns {double[]} the current camera up vector. */
    getUpVector(dst) {
      var cam = this.cam;
      var state = cam.state;
      dst = Vec3.assert(dst);
      Rotation.applyToVec3(state.rotation, cam.UP, dst);
      return dst;
    }
    
    
    
    
    
  
    //
    // STATE (rotation, center, distance)
    //
    /** @returns {Object} a copy of the camera state {distance,center,rotation} */
    getState() {
      return this.state.copy();
    }  
    /** 
     * @param {Object} a new camera state {distance,center,rotation}.
     * @param {long} animation time in millis.
     */
    setState(other, duration) {
      if(other){
        this.setDistance(other.distance, duration);
        this.setCenter  (other.center  , duration);
        this.setRotation(other.rotation, duration);
      }
    }
  
    pushState(){
      return (this.state_pushed = this.getState());
    }
    popState(duration){
      this.setState(this.state_pushed, duration);
    }
    
    /** sets the current state as reset-state. */
    pushResetState(){
      return (this.state_reset = this.getState());
    }
    /** resets the camera, by applying the reset-state. */
    reset(duration){
      this.setState(this.state_reset, duration);
    }
    
    
    
    
    
  
    
    
    /** sets the rotation scale/speed. */
    setRotationScale(scale_rotation){
      this.scale_rotation = scale_rotation;
    }
    /** sets the pan scale/speed. */
    setPanScale(scale_pan){
      this.scale_pan = scale_pan;
    }
    /** sets the zoom scale/speed. */
    setZoomScale(scale_zoom){
      this.scale_zoom = scale_zoom;
    }
    /** sets the wheel scale/speed. */
    setWheelScale(wheelScale) {
      this.scale_zoomwheel = wheelScale;
    }
    /** @returns the rotation scale/speed. */
    getRotationScale(){
      return this.scale_rotation;
    }
    /** @returns the pan scale/speed. */
    getPanScale() {
      return this.scale_pan;
    }
    /** @returns the zoom scale/speed. */
    getZoomScale() {
      return this.scale_zoom;
    }
    /** @returns the wheel scale/speed. */
    getWheelScale() {
      return this.scale_zoomwheel;
    }
    
    /** sets the default damping scale/speed. */
    setDamping(damping) {
      this.dampedZoom.damping = damping;
      this.dampedPanX.damping = damping;
      this.dampedPanY.damping = damping;
      this.dampedRotX.damping = damping;
      this.dampedRotY.damping = damping;
      this.dampedRotZ.damping = damping;
    }
    /** sets the default interpolation time in millis. */
    setDefaultInterpolationTime(duration) {
      this.timedRot .default_duration = duration;
      this.timedPan .default_duration = duration;
      this.timedzoom.default_duration = duration;
    }
    
    
    /** 
     * sets the rotation constraint for each axis separately.
     *
     * @param {boolean} yaw constraint
     * @param {boolean} pitch constraint
     * @param {boolean} roll constraint
     */
    setRotationConstraint(yaw, pitch, roll) {
      var cam = this.cam;
      cam.FIXED_CONSTRAINT  = 0;
      cam.FIXED_CONSTRAINT |= yaw   ? cam.AXIS.YAW   : 0;
      cam.FIXED_CONSTRAINT |= pitch ? cam.AXIS.PITCH : 0;
      cam.FIXED_CONSTRAINT |= roll  ? cam.AXIS.ROLL  : 0;
    }
    
  
   
    /**
     * 
     * begin screen-aligned 2D-drawing.
     * 
     * <pre>
     * beginHUD()
     *   disabled depth test
     *   ortho
     *   ... your code is executed here ...
     * endHUD()
     * </pre>
     * 
     */
    beginHUD(renderer, w, h) {
      var cam = this.cam;
      renderer = renderer || cam.renderer;
      
      if(!renderer) return;
      this.pushed_rendererState = renderer.push();
      
      var gl = renderer.drawingContext;
      var w = (w !== undefined) ? w : renderer.width;
      var h = (h !== undefined) ? h : renderer.height;
      var d = Number.MAX_VALUE;
      
      gl.flush();
      // gl.finish();
      
      // 1) disable DEPTH_TEST
      gl.disable(gl.DEPTH_TEST);
      // 2) push modelview/projection
      //    p5 is not creating a push/pop stack
      this.pushed_uMVMatrix = renderer.uMVMatrix.copy();
      this.pushed_uPMatrix  = renderer.uPMatrix .copy();
      
      // 3) set new modelview (identity)
      renderer.resetMatrix();
      // 4) set new projection (ortho)
      renderer._curCamera.ortho(0, w, -h, 0, -d, +d);
      // renderer.ortho();
      // renderer.translate(-w/2, -h/2);
  
    }
    
    
  
    /**
     * 
     * end screen-aligned 2D-drawing.
     * 
     */
    endHUD(renderer) {
      var cam = this.cam;
      renderer = renderer || cam.renderer;
      
      if(!renderer) return;
      
      var gl = renderer.drawingContext;
      
      gl.flush();
      // gl.finish();
        
      // 2) restore modelview/projection
      renderer.uMVMatrix.set(this.pushed_uMVMatrix);
      renderer.uPMatrix .set(this.pushed_uPMatrix );
      // 1) enable DEPTH_TEST
      gl.enable(gl.DEPTH_TEST);
      renderer.pop(this.pushed_rendererState);
    }
  
    
    
}


function setup() {
  createCanvas(length, length / 2);
  // frame buffer object instances (FBOs)
  fbo1 = createGraphics(width / 2, height, WEBGL);
  fbo2 = createGraphics(width / 2, height, WEBGL);
  // FBOs cams
  cam1 = new Dw.EasyCam(fbo1._renderer, { distance: 200 });
  let state1 = cam1.getState();
  cam1.attachMouseListeners(this._renderer);
  cam1.state_reset = state1;   // state to use on reset (double-click/tap)
  cam1.setViewport([0, 0, width / 2, height]);
  cam2 = new Dw.EasyCam(fbo2._renderer, { rotation: [0.94, 0.33, 0, 0] });
  cam2.attachMouseListeners(this._renderer);
  let state2 = cam2.getState();
  cam2.state_reset = state2;   // state to use on reset (double-click/tap)
  cam2.setViewport([width / 2, 0, width / 2, height]);
  document.oncontextmenu = function () { return false; }
  // scene
  colorMode(RGB, 1);
  let trange = 100;
  boxes = [];
    boxes.push(
      {
        position: createVector(100,0,-200),
        size: 15,
        boxtale: 10,
        color: color(random(), random(), random())
      }
      
    );
  fovy = createSlider(PI / 12, PI * (11 / 12), PI / 3, PI / 48);
  fovy.position(10, 10);
  fovy.style('width', '80px');
}

function draw() {
  fbo1.background(200, 125, 115);
  fbo1.reset();
  fbo1.perspective(fovy.value());
  fbo1.axes();
  //fbo1.grid();
  poioto();
  scene1();
  beginHUD();
  image(fbo1, 0, 0);
  endHUD();
  fbo2.background(130);
  fbo2.reset();
  fbo2.axes();
  //fbo2.grid();
  scene2();
  fbo2.viewFrustum(fbo1);
  beginHUD();
  image(fbo2, width / 2, 0);
  endHUD();
}

function poioto(){

}

function scene1() {
  
  boxes.forEach(box => {
    fbo1.push();
    //fbo1.fill(boxes[box_key] === box ? color('red') : box.color);
    fbo1.noFill('red');
    fbo1.translate(box.position);
    //fbo1.noStroke();
   
    if (boxes[box_key] === box) {
      if (keyIsPressed && !mouseIsPressed) {
        let boxLocation = fbo1.treeLocation([0, 0, 0], { from: fbo1.mMatrix(), to: 'WORLD' });
        let pixelRatio = fbo1.pixelRatio(boxLocation);
        box.target ??= box.size / pixelRatio;
        box.size = box.target * pixelRatio;
        let eyeLocation = fbo1.treeLocation([0, 0, 0], { from: 'EYE', to: 'WORLD' });
        box.position.add(p5.Vector.sub(boxLocation, eyeLocation).normalize().mult(key === 'w' ? SPEED : -SPEED));
      }
      else {
        box.target = undefined;
      }
    }
    fbo1.textSize(500);
    fbo1.text('word', 0, 0);
    fbo1.sphere(box.size);
    //fbo1.sphere(box.size,box.tale,(floor(box.position)%10)+10);
    fbo1.pop();
  }
  );
  fbo1.push();
    
    fbo1.translate(0,0,200)
    fbo1.sphere(20);
    fbo1.push();
    fbo1.translate(25,0,0);
    fbo1.rotateZ(-1.5);
    fbo1.cone(10,40);
    fbo1.pop();
    fbo1.push();
    fbo1.translate(-20,40,0);
    fbo1.sphere(30);
    fbo1.pop();
  fbo1.pop();
}

function scene2() {
  boxes.forEach(box => {
    fbo2.push();
    fbo2.noFill();
    //fbo2.fill(boxes[box_key] === box ? color('red') : box.color);
    fbo2.translate(box.position);
    //fbo2.noStroke();
    fbo2.sphere(box.size);
    fbo2.pop();
  }
  );

  fbo2.push();
  fbo2.translate(0,0,200)
  fbo2.sphere(20);
  fbo2.push();
  fbo2.translate(25,0,0);
  fbo2.rotateZ(-1.5);
  fbo2.cone(10,40);
  fbo2.pop();
  fbo2.push();
  fbo2.translate(-20,40,0);
  fbo2.sphere(30);
  fbo2.pop();
  fbo2.pop();
}

function keyPressed() {
  // press [0..9] keys to pick a box and other keys
  // to unpick, excepting 'w' and 'z' which are used
  // to move the box away or closer to eye.
  if (key !== 'w' && key !== 's') {
    box_key = parseInt(key);
  }
}