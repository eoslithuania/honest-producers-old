
function getLocation(url) {
    if (url == null || url.length == 0) {
        return "";
    }
    var l = document.createElement("a");
    l.href = url;
    return l.hostname.replace(/www[.]/gi, '')
        + l.pathname.replace(/\/$/gi, '') + "</a>";
};

function monospaceText(text) {
    return "<span class='monospace large-font'>" + text + "</span>"
}

function createLink(url, title) {
    if (url == null || url.length == 0) {
        return;
    }
    return "<a class='link' target='_blank' href='" + url + "'>" + title + "</a>";
}

function singleLinkFormatter(url) {
    return createLink(url, getLocation(url));
}

function multilinkFormatter(urls) {
    var aa = urls.map(singleLinkFormatter);
    return aa.reduce((acc, a) => acc + a, "");
}

function titleFormatter(title, dataRow) {
    var url = dataRow["bp-header"]["prepared-url"];
    var monospaceTitle = monospaceText(title);
    if (url == null) {
        return monospaceTitle;
    }
    return createLink(url, monospaceTitle);
}



function produceModalListUrl(url) {
    return '<li class="list-group-item"><a target="_blank" href="' + url + '" class="card-text">' + url + '</p></li>';
}

function produceModalListUrls(urls) {
    var aa = urls.map(produceModalListUrl);
    return aa.reduce((acc, a) => acc + a, "");
}

var mutableDataRef = null;

function openMoreInfoDialog(dataRowId) {
    dataRow = mutableDataRef["block-producers"][dataRowId];
    $("#myModal .modal-title") .html(dataRow["bp-header"]["owner"])
    $("#myModal #modal-social-links") .html(produceModalListUrls(dataRow["analyzed-urls"]["social-links"]))
    $("#myModal #modal-self-promotion-links") .html(produceModalListUrls(dataRow["analyzed-urls"]["popularity-boosters"]))
    $("#myModal").modal();
}

function moreInfoFormatter(idk, dataRow, dataId) {
    return "<button \
        class='btn btn-primary btn-sm' \
        onClick='openMoreInfoDialog(" + dataId + ")'>More info</button>";
}

// Tooltip enable
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

function placeFormatter(placeId) {
    return placeId + 1;
}

function isProd() {
  return !(window.location.href.match(/^file.*/));
}
function getDebugDataUrl() {
  var urlSepIndex = window.location.href.lastIndexOf("/") + 1;
  return window.location.href.substring(0, urlSepIndex).concat("data.json");
}
function getDataUrl() {
  if(isProd()) {
    return "https://cleos.sh/eos-data/data/data.json";
  }
  return getDebugDataUrl();
}

fetch(getDataUrl())
    .then(res => res.json())
    .then((out) => {
        mutableDataRef = out;
        $(function () {
            $('#snapshot-date-value').html(out['snapshot-date-utc']);
            $('#snapshot-date').show();
            $('#table').bootstrapTable({
                data: out['block-producers'],
                columns: [
                    [
                        {
                            field: 'place',
                            title: '#',
                            sortable: true,
                            rowspan: 2,
                            formatter: placeFormatter,
                        },
                        {
                            field: 'bp-header.owner',
                            title: 'BP name',
                            sortable: true,
                            rowspan: 2,
                            formatter: titleFormatter,
                        },
                        {
                            title: 'Webpage content summary',
                            colspan: 3,
                        },
                    ],
                    [
                        {
                            title: 'Social links',
                            field: 'analyzed-urls.social-links-count',
                            sortable: true,
                            align: 'right',
                        }, {
                            title: 'Popularity boost links',
                            field: 'analyzed-urls.popularity-boosters-count',
                            sortable: true,
                            align: 'right',
                        },
                        {
                            formatter: moreInfoFormatter,
                        },

                    ]]
            });
        });
    })
    .catch(err => { throw err });
