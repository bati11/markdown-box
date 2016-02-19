var React = require('react');

var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;

var Header = require('./Header');
var FileTree = require('./FileTree');
var Content = require('./Content');

var storage = require('../storage');


module.exports = React.createClass({
  displayName: "App",
  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      data: [],
      selectedEntry: {
        isFolder: true,
        path: "/",
        name: "/",
        children: []
      }
    };
  },
  componentDidMount: function() {
    var _this = this;
    storage.rootFiles(function(entries) {
      _this.setState({data: entries});
      var path = _this.props.params.path || '/';
      _this._fetch(path);
    });
  },
  componentDidUpdate: function(prevProps) {
    var oldPath = prevProps.params.path || '/';
    var newPath = this.props.params.path || '/';
    if (newPath && oldPath != newPath) {
      this._fetch(newPath);
    }
  },
  _fetch: function(path) {
    var _this = this;
    storage.readEntry(path, function(entry) {
      _this.setState({selectedEntry: entry});
      if (entry.isFolder && entry.children.length == 0) {
        _this._fetchChildren(entry);
      }
    });
  },
  _fetchChildren: function(entry) {
    var _this = this;
    storage.readdir(entry.path, function(entries) {
      entry.children = entries;
      _this.setState({data: _this.state.data});
    });
  },
  _selectEntry: function(entry) {
    this.context.router.push('/viewer/' + encodeURIComponent(entry.path));
  },
  _createFile: function(params) {
    var _this = this;
    storage.writefile(params.parentFolder.path + "/" + params.name, params.content, function() {
      _this._fetchChildren(params.parentFolder);
    });
  },
  _createFolder: function(params) {
    var _this = this;
    storage.makedir(params.parentFolder.path + "/" + params.name, function() {
      _this._fetchChildren(params.parentFolder);
    });
  },
  render: function() {
    return (
      <div>
        <Header />
        <Grid>
          <Row className="show-grid">
            <Col
                md={2}
                xs={12}>
              <FileTree
                  entries={this.state.data}
                  onEntryClick={this._selectEntry}
                  onToggleButtonClick={this._fetchChildren} />
            </Col>
            <Col
                md={10}
                xs={12}>
              <Content
                  createFileAction={this._createFile}
                  createFolderAction={this._createFolder}
                  entry={this.state.selectedEntry}
                  onEntryClick={this._selectEntry} />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

