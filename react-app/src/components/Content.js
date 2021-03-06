var React = require('react');

var FileContent = require('./FileContent');
var FolderContent = require('./FolderContent');

var storage = require('../storage');


module.exports = React.createClass({
  displayName: "Content",
  getInitialState: function() {
    return {
      content: ''
    };
  },
  componentDidMount: function() {
    this._fetchContent();
  },
  componentDidUpdate: function(prevProps) {
    var oldEntry = prevProps.entry;
    var newEntry = this.props.entry;
    if (newEntry && oldEntry.path != newEntry.path) {
      this._fetchContent(newEntry.path);
    }
  },
  _fetchContent: function() {
    var _this = this;
    if (this.props.entry.isFolder) {
      _this.setState({content: ""});
    } else {
      storage.readfile(this.props.entry.path, function(content) {
        _this.setState({content: content});
      });
    }
  },
  _updateContent: function(params) {
    var _this = this;
    storage.writefile(this.props.entry.path, params.content, function() {
      _this.setState({content: params.content});
    });
  },
  render: function() {
    var content;
    if (this.props.entry.isFolder) {
      content = (
        <FolderContent
            createFileAction={this.props.createFileAction}
            createFolderAction={this.props.createFolderAction}
            entry={this.props.entry}
            selectEntryAction={this.props.onEntryClick} />
      );
    } else {
      content = (
        <FileContent
            content={this.state.content}
            entry={this.props.entry}
            updateContentAction={this._updateContent}
            selectEntryAction={this.props.onEntryClick} />
      );
    }
    return (
      <div>
        {content}
      </div>
    );
  }
});

