/** @jsx React.DOM */
var assert = require('chai').assert;
var _ = require('lodash');

var Explorer = require('../../../../client/js/app/components/explorer/index.js');
var CacheToggle = require('../../../../client/js/app/components/explorer/cache_toggle.js');
var ReactSelect = require('../../../../client/js/app/components/common/react_select.js');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var TestHelpers = require('../../../support/TestHelpers.js');
var $R = require('rquery')(_, React);

describe('components/explorer/cache_toggle', function() {
  beforeEach(function() {
    this.model = TestHelpers.createExplorerModel();
    this.model.metadata.user = { id: 1 };
    this.model.metadata.display_name = 'A saved query name';
    this.model.refresh_rate = 0;

    this.defaultProps = {
      model: this.model,
      user: { id: 1 }
    }

    this.renderComponent = function(props) {
      var props = _.assign({}, this.defaultProps, props);
      return TestUtils.renderIntoDocument(<CacheToggle {...props}/>);
    };
    this.component = this.renderComponent();
  });

  describe('setup', function() {
    it('is of right type', function() {
      assert.isTrue(TestUtils.isCompositeComponentWithType(this.component, CacheToggle));
    });
  });

  describe('enable caching checkbox', function() {
    it('allows user to enable caching if refresh_rate is 0', function() {
      var checkboxLabel = $R(this.component).find('[htmlFor="cache"]');

      assert.equal(checkboxLabel.text(), 'Enable caching');
    })

    it('allows user to turn off caching if refresh_rate is not 0', function() {
      this.model.refresh_rate = 14400;
      this.component.forceUpdate();

      assert.equal($R(this.component).find('[htmlFor="cache"]').text(), 'Caching enabled');
    });
  });

  describe('refresh rate dropdown', function() {
    it('opens when config button is clicked and displays correct value', function() {
      this.model.refresh_rate = 86400;
      this.component.forceUpdate();
      assert.match($R(this.component).find('.cache-settings')[0].getDOMNode().className, /hide/);

      TestUtils.Simulate.click($R(this.component).find('.margin-left-tiny').components[0].getDOMNode());
      var cacheSettings = $R(this.component).find('.cache-settings')[0].getDOMNode();

      assert.isNotNull(TestUtils.findRenderedComponentWithType(this.component, ReactSelect));
      assert.notMatch(cacheSettings.className, /hide/);
      assert.equal(cacheSettings.getElementsByTagName('input')[0].value, '24');
    });
  });
});
