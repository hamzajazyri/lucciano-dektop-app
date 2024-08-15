import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, input, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import WaveSurfer from 'wavesurfer.js';
import { WorkspaceService } from '../../services/workspace.service';
// @ts-ignore
// import 'wave-audio-path-player';

import {LiveAnnouncer} from '@angular/cdk/a11y';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';

export interface Fruit {
  name: string;
}



@Component({
  selector: 'app-music-item',
  standalone: true,
  imports: [MatFormFieldModule, MatChipsModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add this line
  templateUrl: './music-item.component.html',
  styleUrl: './music-item.component.scss'
})
export class MusicItemComponent implements OnInit, OnDestroy {

  workspaceSrv = inject(WorkspaceService);

  audioUrl = input.required<string>();

  isStop = signal(true);

  audioName = computed(() => {
    return this.getFileName(this.audioUrl());
  })

  @ViewChild('waveformContainer', { static: true }) waveformContainer!: ElementRef;
  public waveSurfer!: WaveSurfer;

  ngOnInit(): void {
    this.waveSurfer = WaveSurfer.create({
      container: this.waveformContainer.nativeElement,
      waveColor: 'violet',
      progressColor: 'purple',
      height: 128,
      
      // responsive: true
    });


    // Load your audio file
    this.waveSurfer.load(this.audioUrl());

    this.getDescription();
  }


  getFileName(path: string){
    const regex = /[^\\/]+$/;
    const match = path.match(regex);
    return match ? match[0] : '';

  }

  getDescription(){
    this.workspaceSrv.getFileNotes(this.audioUrl()).then( (result:any) => {
      console.log(result);
      this.notes.update( notes => [...notes, ...result]);
    })
  }

  playPause(): void {
    this.waveSurfer.playPause();
  }

  stop(): void {
    this.waveSurfer.stop();
  }

  showNotes = signal(true);
  toggleNotes() {
    this.showNotes.update( b => !b);
  }
  
  ngOnDestroy(): void {
    this.waveSurfer.destroy();
  }



  //// chips notes

  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly notes = signal<any[]>([]);
  // {description: 'Lemon', id:1}, {description: 'Lime', id:2}, {description: 'Apple', id:3}
  // readonly announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our note
    if (value) {
      this.workspaceSrv.addFileNote(this.audioUrl(), value).then( (result:any) => {
        this.notes.update(notes => [...notes, {description: value, id: result}]);
      })      
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(note: any): void {
    this.notes.update(notes => {
      const index = notes.indexOf(note);
      if (index < 0) {
        return notes;
      }
      this.workspaceSrv.deleteNote(note.id).then( (result:any) => {
        console.log("delete note: ", result);
      });
      notes.splice(index, 1);
      // this.announcer.announce(`Removed ${notes.description}`);
      return [...notes];
    });
  }

  edit(note: any, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove note if it no longer has a name
    if (!value) {
      this.remove(note);
      return;
    }

    // Edit existing note
    this.notes.update(notes => {
      const index = notes.indexOf(note);
      if (index >= 0) {
        notes[index].description = value;
        return [...notes];
      }
      return notes;
    });
  }
}
