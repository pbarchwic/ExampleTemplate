import { CustomEventsConfig } from '@app/core';

export class TrackEventController {
  public readonly eventPlaces = CustomEventsConfig.places;
  public readonly eventNames = CustomEventsConfig.events;
  public readonly eventComponents = CustomEventsConfig.components;
}
