
export class RouterStub {
  navigateByUrl(url: string) { return url; }

  navigate (linkParams: [any]) { return linkParams.join('/'); }
}


export class ActivatedRouteStub {

  params = {
    subscribe: (fn) => fn(this.testParams),
    forEach: (fn) => fn(this.testParams)
  };

  // Test parameters
  private _testParams: {};
  get testParams() { return this._testParams; }
  set testParams(params: {}) {
    this._testParams = params;
  }

  // ActivatedRoute.snapshot.params
  get snapshot() {
    return { params: this.testParams };
  }
}
