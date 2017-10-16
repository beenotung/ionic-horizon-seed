import {inject, TestBed} from "@angular/core/testing";

import {LoadingService} from "./loading.service";
import {AppModule} from "../../app/app.module";
import {IonicMockProviders} from "../../test/ionic.spec";

describe("LoadingService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: IonicMockProviders,
    });
  });

  it("should be created", inject([LoadingService], (service: LoadingService) => {
    expect(service).toBeTruthy();
  }));
});
