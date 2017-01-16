import {Component, OnInit} from "@angular/core";
import {Location} from "@angular/common";

import {Couchbase} from "nativescript-couchbase";
let CryptoJS = require("crypto-js");

@Component({
    selector: "example",
    templateUrl: "./components/example/example.component.html"
})

export class ExampleComponent implements OnInit {

    private database: Couchbase;
    private header: string;

    private presidentList: any = [];

    readonly VERY_SECRET_CODE: string = 'My very secret code';

    public constructor(private location: Location) {
        this.database = new Couchbase("sampledb");
    }

    public ngOnInit() {
        this.database.createView("sampledata", "1", function (document, emitter) {
            emitter.emit(document._id, document);
        });
        let documents = this.database.executeQuery("sampledata");
        if (documents[0]) {
            this.header = 'Found ' + (documents.length) + ' documents!';
            for (let i = 0; i < documents.length; i++) {
                this.presidentList.push(documents[i]);
            }
        }
        else {
            this.header = 'No documents found!';
        }
    }

    public loadData() {
        this.database.createDocument(JSON.parse('{"name": "Barack Obama", "codename": "' + this._encryptData('Renegade') + '"}'));
        this.database.createDocument(JSON.parse('{"name": "George W. Bush", "codename": "' + this._encryptData('Trailblazer') + '"}'));
        this.database.createDocument(JSON.parse('{"name": "Bill Clinton", "codename": "' + this._encryptData('Eagle') + '"}'));
        this.database.createDocument(JSON.parse('{"name": "Ronald Reagan", "codename": "' + this._encryptData('Rawhide') + '"}'));
        let documents = this.database.executeQuery("sampledata");
        this.header = 'Found ' + (documents.length) + ' documents!';
        for (let i = 0; i < documents.length; i++) {
            this.presidentList.push(documents[i]);
        }
    }

    public deleteData() {
        let documents = this.database.executeQuery("sampledata");
        for (let i = 0; i < documents.length; i++) {
            this.database.deleteDocument(documents[i]._id);
        }
        this.presidentList = [];
        this.header = 'All documents are deleted!';
    }


    public showCodeName(event) {
        alert(this._decryptData(this.presidentList[event.index].codename));
    }

    public goBack() {
        this.location.back();
    }


    private _encryptData(data: string): string {
        let cipherText = CryptoJS.AES.encrypt(data, this.VERY_SECRET_CODE.toString());
        return cipherText;
    }

    private _decryptData(data: string): string {
        let bytes = CryptoJS.AES.decrypt(data.toString(), this.VERY_SECRET_CODE.toString());
        let plainText = bytes.toString(CryptoJS.enc.Utf8);
        return plainText;
    }


}
