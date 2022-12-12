import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowListComponent } from './follow-list.component';

describe('FollowingListComponent', () => {
    let component: FollowListComponent;
    let fixture: ComponentFixture<FollowListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FollowListComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(FollowListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
