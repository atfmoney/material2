import {browser, by, element, ElementArrayFinder, ElementFinder, Key} from 'protractor';
import {pressKeys} from '../../util/actions';

describe('tabs', () => {
  describe('basic behavior', () => {
    let tabGroup: ElementFinder;
    let tabLabels: ElementArrayFinder;
    let tabBodies: ElementArrayFinder;

    beforeEach(() => {
      browser.get('/tabs');
      tabGroup = element(by.css('md-tab-group'));
      tabLabels = element.all(by.css('.mat-tab-label'));
      tabBodies = element.all(by.css('md-tab-body'));
    });

    it('should change tabs when the label is clicked', () => {
      tabLabels.get(1).click();
      expect(getLabelActiveStates(tabLabels)).toEqual([false, true, false]);
      expect(getBodyActiveStates(tabBodies)).toEqual([false, true, false]);

      tabLabels.get(0).click();
      expect(getLabelActiveStates(tabLabels)).toEqual([true, false, false]);
      expect(getBodyActiveStates(tabBodies)).toEqual([true, false, false]);
    });

    it('should change focus with keyboard interaction', () => {
      let right = Key.RIGHT;
      let left = Key.LEFT;

      tabLabels.get(0).click();
      expect(getFocusStates(tabLabels)).toEqual([true, false, false]);

      pressKeys(right);
      expect(getFocusStates(tabLabels)).toEqual([false, true, false]);

      pressKeys(right);
      expect(getFocusStates(tabLabels)).toEqual([false, false, true]);

      pressKeys(right);
      expect(getFocusStates(tabLabels)).toEqual([false, false, true]);

      pressKeys(left);
      expect(getFocusStates(tabLabels)).toEqual([false, true, false]);

      pressKeys(left);
      expect(getFocusStates(tabLabels)).toEqual([true, false, false]);

      pressKeys(left);
      expect(getFocusStates(tabLabels)).toEqual([true, false, false]);
    });
  });
});

/**
 * Returns an array of true/false that represents the focus states of the provided elements.
 */
function getFocusStates(elements: ElementArrayFinder) {
  return elements.map(element => {
    return element.getText().then(elementText => {
      return browser.driver.switchTo().activeElement().getText().then(activeText => {
        return activeText === elementText;
      });
    });
  });
}

/** Returns an array of true/false that represents the active states for the provided elements. */
function getLabelActiveStates(elements: ElementArrayFinder) {
  return getClassStates(elements, 'mat-tab-label-active');
}

/** Returns an array of true/false that represents the active states for the provided elements */
function getBodyActiveStates(elements: ElementArrayFinder) {
  return getClassStates(elements, 'mat-tab-body-active');
}

/**
 * Returns an array of true/false values that represents whether the provided className is on
 * each element.
 */
function getClassStates(elements: ElementArrayFinder, className: string) {
  return elements.map(element => {
    return element.getAttribute('class').then(classes => {
      return classes.split(/ +/g).indexOf(className) >= 0;
    });
  });
}
