/*import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'premier-app';
}
*/
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormArray, Validators} from '@angular/forms';
import Quagga from 'quagga';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  deviceDetailsForm: any;
  barcodeRead: boolean = false; checkDamage: boolean = false; repCord: boolean = false; fuseOK: boolean = false; displayStatus: boolean = false;
  isDamaged: boolean = false; power: boolean = false; cordDamage: boolean = false;
  selectDevices: boolean = false; deviceSelected: boolean = false; public device: any; isChangeRPM: boolean = false; isVibration: boolean = false; isCarbon: boolean = false; isLid: boolean = false; isYesComplete: boolean = false; isFuseBurnt: boolean = false; isChangeFuse: boolean = false; isOpenPanel: boolean = false; isTransformer: boolean = false; isReplaceTransformer: boolean = false; isCheckVoltage: boolean = false; afterCheckVoltage: boolean = false;
  isCB: boolean = false; isPotentiometer: boolean = false; isReplacePotentiometer: boolean = false; isCleanCarbon: boolean = false; isReplaceCarbon: boolean = false; isReplaceMotor: boolean = false; isChangeSensor: boolean = false;
  barcode = '';
  barcodeResult;
  configQuagga = {
    inputStream: {
      name: 'Live',
      type: 'LiveStream',
      target: '#inputBarcode',
      constraints: {
        width: { min: 640 },
        height: { min: 480 },
        aspectRatio: { min: 1, max: 100 },
        facingMode: 'environment', // or user
      },
      singleChannel: false // true: only the red color-channel is read
    },
    locator: {
      patchSize: 'medium',
      halfSample: true
    },
    locate: true,
    numOfWorkers: 4,
    decoder: {
      readers: ['code_128_reader']
    }
  };
  constructor(private ref: ChangeDetectorRef, private formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log('Barcode: initialization');
	this.createForm();
  }
  
 createForm() {
	  this.deviceDetailsForm = this.formBuilder.group({
      device_type: ['', Validators.required]
    });
  }

  testChangeValues() {
    this.barcode = 'Code-barres bidon : 0123456789';
  }
  
  startScanner() {
    this.barcode = '';
	this.barcodeRead = false;
	this.selectDevices = false;
	this.deviceSelected = false;
	this.checkDamage = false;
	this.power = false;
	this.cordDamage = false;
	this.repCord = false;
	this.fuseOK = false;
	this.displayStatus = false;
    this.ref.detectChanges();

    Quagga.onProcessed((result) => this.onProcessed(result));

    Quagga.onDetected((result) => this.logCode(result));

    Quagga.init(this.configQuagga, (err) => {
      if (err) {
        return console.log(err);
      }
      Quagga.start();
      console.log('Barcode: initialization finished. Ready to start');
    });


  }

  private onProcessed(result: any) {
    const drawingCtx = Quagga.canvas.ctx.overlay;
    const drawingCanvas = Quagga.canvas.dom.overlay;

    if (result) {
      if (result.boxes) {
        drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width'), 10), parseInt(drawingCanvas.getAttribute('height'), 10));
        result.boxes.filter(function (box) {
          return box !== result.box;
        }).forEach(function (box) {
          Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: 'green', lineWidth: 2 });
        });
      }

      if (result.box) {
        Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: '#00F', lineWidth: 2 });
      }

      if (result.codeResult && result.codeResult.code) {
        Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
      }
    }
  }

  private logCode(result) {
    const code = result.codeResult.code;
   
    if (this.barcode !== code) {
      this.barcode = '' + code;
      this.barcodeResult=result.codeResult;
      this.ref.detectChanges();
	  this.barcodeRead = true;
	  this.deviceSelected = false;
	  this.selectDevices = false;
	  
      console.log(this.barcode);
      console.log(this.barcodeResult);

      // this.barcodeValue = result.codeResult.code;
      // this.barcodeResult=result.codeResult
      // console.log("this.barcodeValue",this.barcodeValue)

      console.log("JSON.stringify(result.codeResult)",JSON.stringify(result.codeResult))
      console.log("Result",result)
      console.log("JSON.stringify(result)",JSON.stringify(result))
      // console.log("this.barcodeResult",this.barcodeResult.json())
      Quagga.stop();
    }
  }
  
  showDevices() {
	this.selectDevices = true;
	this.barcodeRead = false;
	this.checkDamage = false;
	this.power = false;
	this.cordDamage = false;
	this.repCord = false;
	this.fuseOK = false;
	this.displayStatus = false;
	this.deviceDetailsForm.value['device_type'] = null;
	this.isYesComplete = false;
	this.isChangeSensor = false;
	this.isYesComplete = false;
	this.isLid = false;
	this.isReplaceMotor = false;
	this.isVibration = false;
	this.isReplaceCarbon = false;
	this.isCarbon = false;
	this.isReplacePotentiometer = false;
	this.isCleanCarbon = false;
	this.isPotentiometer = false;
	this.isCB = false;
	this.isCheckVoltage = false;
	this.isReplaceTransformer = false;
	this.isTransformer = false;
	this.isOpenPanel = false;
	this.isChangeFuse = false;
	this.isFuseBurnt = false;
	Quagga.stop();
  }

  checkDamageStatus() {
	this.barcodeRead = false;
    this.checkDamage = true;
	this.deviceSelected = false;
	this.power = false;
	//this.selectDevices = false;
  }
  
  damageStatus() {
    this.isDamaged = true;
	this.checkDamage = false;
  }
  
  powerOn() {
    this.power = true;
	this.checkDamage = false;
	this.cordDamage = false;
	this.displayStatus = false;
  }
  checkCord() {
	this.power = false;
    this.cordDamage = true;
	this.repCord = false;
  }
  replaceCord() {
	this.cordDamage = false;
	this.repCord = true;
	this.fuseOK = false;
  }
  
  checkFuse() {
	this.device = this.deviceDetailsForm.value['device_type'];
	console.log(this.selectDevices);
	this.repCord = false;
	this.cordDamage = false;
	this.fuseOK = true;
	this.isFuseBurnt = false;
  }
  
  checkDeviceFuse() {
	this.device = this.deviceDetailsForm.value['device_type'];
	console.log(this.selectDevices);
	this.repCord = false;
	this.cordDamage = false;
	this.fuseOK = false;
	this.isChangeFuse = false;
	this.isFuseBurnt = true;
  }
  changeFuse() {
	this.isFuseBurnt = false;
	this.isChangeFuse = true;
  }
  
  checkDisplay() {
	this.fuseOK = false;
	this.power = false;
    this.displayStatus = true;
	this.repCord = false;
	this.isFuseBurnt = false;
	this.isChangeRPM = false;
	this.isChangeFuse = false;
	this.isOpenPanel = false;
	this.isCheckVoltage = false;
	this.isReplaceTransformer = false;
  }
  openPanel() {
    this.isOpenPanel = true;
	this.displayStatus = false;
	this.isChangeFuse = false;
	this.isTransformer = false;
  }
  checkTransformer() {
    this.isTransformer = true;
	this.isOpenPanel = false;
	this.isCheckVoltage = false;
  }
  replaceTrans() {
	this.isTransformer = false;
	this.isReplaceTransformer = true;
	this.isCheckVoltage = false;
  }
  checkVoltage() {
    this.isTransformer = false;
	this.isCheckVoltage = true;
	this.isReplaceTransformer = false;
	this.afterCheckVoltage = true;
	this.isCB = false;
  }
  changeCB() {
    this.isCB = true;
	this.isCheckVoltage = false;
  }
  changeRPM() {
    this.displayStatus = false;
	this.power = false;
	this.isChangeRPM = true;
	this.isCB = false;
	this.isPotentiometer = false;
	this.isReplacePotentiometer = false;
  }
  checkPotentiometer() {
    this.isPotentiometer = true;
	this.isCB = false;
	this.isChangeRPM = false;
	this.isCleanCarbon = false;
  }
  checkCarbon() {
	this.isChangeRPM = false;
    this.isCarbon = true;
	this.isPotentiometer = false;
	this.isReplacePotentiometer = false;
	this.isCleanCarbon = false;
	this.isReplaceCarbon = false;
  }
  cleanCarbon() {
    this.isCleanCarbon = true;
	this.isPotentiometer = false;
  }
  replacePotentiometer() {
    this.isPotentiometer = false;
	this.isReplacePotentiometer = true;
	this.isCleanCarbon = false;
  }
  replaceCarbon() {
    this.isPotentiometer = false;
	this.isReplaceCarbon = true;
	this.isCleanCarbon = false;
	this.isCarbon = false;
	this.isVibration = false;
  }
  checkVibration() {
	this.isCarbon = false;
    this.isVibration = true;
	this.isReplaceMotor = false;
	this.isLid = false;
	this.isReplaceCarbon = false;
  }
  checkLid() {
	this.isLid = true;
    this.isVibration = false;
	this.isReplaceMotor = false;
	this.isChangeSensor = false;
  }
  replaceMotor() {
    this.isVibration = false;
	this.isReplaceMotor = true;
	this.isCleanCarbon = false;
	this.isLid = false;
  }
  changeSensor() {
    this.isChangeSensor = true;
	this.isReplaceMotor = false;
	this.isLid = false;
  }
  completeYesCheck() {
	this.isLid = false;
	this.isYesComplete = true;
	this.isChangeSensor = false;
  }
  
  back() {
	this.barcodeRead = false;
    this.checkDamage = false;
	this.isDamaged = false;
	this.displayStatus = false;
	this.fuseOK = false;
	this.repCord = false;
	this.cordDamage = false;
	this.power = false;
	this.deviceSelected = false;
	this.isLid = false;
}
  onSelectDevice(event: any) {
	this.deviceSelected = true;
    this.device = event.target.value;
	console.log(this.device);
  }
}