import type { AdSurface, Vec3Data } from '../shared/types';
import { AD_TEXTS } from './AdSurface';

export class AdManager {
  private nextId = 1;

  createBillboardAd(position: Vec3Data, rotationY: number, text = this.randomText()): AdSurface {
    return {
      id: this.createId('billboard'),
      type: 'billboard',
      text,
      position,
      rotationY,
      width: 12.8,
      height: 5.7,
      dynamic: false
    };
  }

  createBuildingBannerAd(
    position: Vec3Data,
    rotationY: number,
    width: number,
    height: number,
    text = this.randomText()
  ): AdSurface {
    return {
      id: this.createId('banner'),
      type: 'building-banner',
      text,
      position,
      rotationY,
      width,
      height,
      dynamic: false
    };
  }

  createVehicleBranding(
    attachedObjectId: string,
    position: Vec3Data,
    rotationY: number,
    text = 'BRANDED VEHICLE'
  ): AdSurface {
    return {
      id: this.createId('vehicle-brand'),
      type: 'vehicle-branding',
      text,
      position,
      rotationY,
      width: 2.4,
      height: 0.72,
      dynamic: false,
      attachedObjectId
    };
  }

  createDigitalVideoScreen(position: Vec3Data, rotationY: number): AdSurface {
    return {
      id: this.createId('video-screen'),
      type: 'digital-video-screen',
      text: 'VIDEO AD SCREEN',
      position,
      rotationY,
      width: 12.2,
      height: 6.1,
      dynamic: true
    };
  }

  createRooftopSign(position: Vec3Data, rotationY: number, text = 'SPONSOR'): AdSurface {
    return {
      id: this.createId('rooftop'),
      type: 'rooftop-sign',
      text,
      position,
      rotationY,
      width: 9.8,
      height: 2.7,
      dynamic: false
    };
  }

  private createId(prefix: string): string {
    const id = `${prefix}-${this.nextId}`;
    this.nextId += 1;
    return id;
  }

  private randomText(): string {
    return AD_TEXTS[Math.floor(Math.random() * AD_TEXTS.length)];
  }
}
