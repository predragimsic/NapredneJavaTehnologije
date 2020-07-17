import { Component, OnInit, Input } from '@angular/core';
import { Actor } from 'src/app/model/actor.model';

@Component({
  selector: 'app-actor-element',
  templateUrl: './actor-element.component.html',
  styleUrls: ['./actor-element.component.scss'],
})
export class ActorElementComponent implements OnInit {
  @Input() actor: Actor;
  constructor() { }

  ngOnInit() {}

}
