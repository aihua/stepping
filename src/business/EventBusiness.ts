import {EventEntity} from '../entity/EventEntity';
import {EventPublisher} from '../observer/EventPublisher';
import {EventSubscriber} from '../observer/EventSubscriber';
import {BaseEvent} from '../observer/BaseEvent';
import {EventModel} from '../model/EventModel';
import {Renderer} from '../render/Renderer';
import {SVGGenerator} from '../render/SVGGenerator';
import {EventPositionEntity} from '../entity/EventPositionEntity';

export class EventBusiness {
  private eventPublisher: EventPublisher;

  constructor(subscriber) {
    this.eventPublisher = new EventPublisher();
    this.eventPublisher.RegisterObserver(subscriber);
  }

  createEventSticky(name): EventEntity {
    let eventEntity = new EventEntity(name);
    this.eventPublisher.NotifyObservers('event.created', eventEntity);

    return eventEntity;
  }

  updateEventSticky(entity: EventEntity): EventEntity {
    this.eventPublisher.NotifyObservers('event.updated', entity);
    return entity;
  }

  addRelatedChild(createdEntity: EventEntity, subEntity: EventEntity) {
    createdEntity.addRelatedChild(subEntity);
    this.updateEventSticky(subEntity);

    return createdEntity
  }
}

export class EventBusinessStore {
  eventModel: EventModel;
  store: EventEntity[] = [];

  constructor(eventSubscriber: EventSubscriber) {
    let createdEvent = new BaseEvent('event.created', this.handleCreatedEvent.bind(this));
    let updatedEvent = new BaseEvent('event.updated', this.handleUpdatedEvent.bind(this));

    eventSubscriber.registerEvent(createdEvent);
    eventSubscriber.registerEvent(updatedEvent);

    this.eventModel = new EventModel();
  }

  handleCreatedEvent(entity) {
    this.store.push(entity);
    this.eventModel.createStore(entity, this.store);
  }

  handleUpdatedEvent(entity) {
    for (let index in this.store) {
      if (this.store[index].id === entity.id) {
        this.store[index] = entity;
      }
    }

    this.eventModel.updateStore(entity, this.store);
  }
}

export class EventStickyRender {
  generator: SVGGenerator;
  nodes: EventEntity[] = [];
  renderer: Renderer;

  constructor(eventSubscriber: EventSubscriber) {
    this.generator = new SVGGenerator();
    this.renderer = new Renderer(this.generator);

    let createdEvent = new BaseEvent('event.created', this.handleCreatedEvent.bind(this));
    let updatedEvent = new BaseEvent('event.updated', this.handleUpdatedEvent.bind(this));
    eventSubscriber.registerEvent(createdEvent);
    eventSubscriber.registerEvent(updatedEvent);
  }

  handleCreatedEvent(entity) {
    this.nodes.push(entity);
    this.renderer.createEntity(entity, this.nodes);
    this.render();
  }

  handleUpdatedEvent(entity: EventPositionEntity) {
    for (let index in this.nodes) {
      if (this.nodes[index].id === entity.id) {
        this.nodes[index] = entity;
      }
    }
    this.renderer.updateEntity(entity, this.nodes);
    this.render();
  }

  render() {
    return this.renderer.render();
  }
}
