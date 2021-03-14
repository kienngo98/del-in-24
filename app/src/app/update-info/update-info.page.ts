import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { FirebaseApp } from '@angular/fire';
import { LoadService } from '../services/load.service';

@Component({
  selector: 'app-update-info',
  templateUrl: './update-info.page.html',
  styleUrls: ['./update-info.page.scss'],
})
export class UpdateInfoPage implements OnInit {
  defaultPhotoURL: string = '../../assets/images/blank-avatar.png';
  uploadImageURL: string = '../../assets/images/upload-option.png';
  currentUserImage: string = (this.dataService.currentUser.photoURL) ? this.dataService.currentUser.photoURL : this.defaultPhotoURL;
  isUploadingNewPhoto: boolean = false;

  constructor(
    private firebase: FirebaseApp,
    // private fireStore: AngularFirestore,
    private modalCtrl: ModalController,
    public dataService: DataService,
    private storage: AngularFireStorage,
    public loader: LoadService
  ) {}

  ngOnInit() {

  }

  dismissUpdateForm() {
    this.modalCtrl.dismiss();
  }

  showUploadOption() {
    this.isUploadingNewPhoto = true;
    this.currentUserImage = this.uploadImageURL;
  }

  hideUploadOptoin() {
    this.isUploadingNewPhoto = true;
    this.currentUserImage = (this.dataService.currentUser.photoURL) ? this.dataService.currentUser.photoURL : this.defaultPhotoURL;
  }

  openImagePicker():void {
    if (!this.isUploadingNewPhoto) return;
    document.getElementById('fileUploader').click();
  }

  uploadNewImageToFirebase(event: any) {
    const file = event.target.files[0];
    const path = `avatars/${this.dataService.currentUser.email}/`;
    const ref = this.storage.ref(path);

    this.loader.presentLoading(10000, 'Uploading image ...');
    return ref.put(file)
      .then(() => {
        const imageRef = this.storage.ref(path);
        const imageUrlSub = imageRef.getDownloadURL().subscribe(url => {
          this.currentUserImage = url;
          this.dataService.currentUser.photoURL = url;

          // Update current user's photoURL
          this.firebase.auth().currentUser.updateProfile({ photoURL: url }).then(() => {
            this.loader.dismissLoading();
            imageUrlSub.unsubscribe();
          });

          // Update new phot url to Firestore - not sure we need this
          // return this.fireStore.doc(`users/${this.dataService.currentUser.uid}`).update({
          //   photoURL: url
          // })
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
}
