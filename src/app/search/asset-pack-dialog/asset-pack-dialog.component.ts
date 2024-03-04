import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

export interface DialogData {
  assetPack: 'robbie' | 'diffusion';
}

@Component({
  selector: 'app-asset-pack-dialog',
  templateUrl: './asset-pack-dialog.component.html',
  styleUrls: ['./asset-pack-dialog.component.scss']
})
export class AssetPackDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
  }

}
