
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
    return "<a class='link' href='" + url + "'>" + title + "</a>";
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

var mutableDataRef = null;

function openMoreInfoDialog(dataRowId) {
    dataRow = mutableDataRef["block-producers"][dataRowId];
    console.log("Works", dataRow);
    $("#myModal .modal-title").html(dataRow["bp-header"]["owner"])
    $("#myModal").modal();
}

function moreInfoFormatter(idk, dataRow, dataId) {
    return "<button \
        class='btn btn-info btn-sm' \
        onClick='openMoreInfoDialog(" + dataId + ")'>More info</button>";
}

fetch("./data/data.json")
    .then(res => res.json())
    .then((out) => {
        mutableDataRef = out;
        $(function () {
            $('#table').bootstrapTable({
                data: out['block-producers'],
                pageList:[10, 50, 100, "All"],
                columns: [
                    [
                        {
                            title: 'Rating',
                            sortable: true,
                            rowspan: 2,
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
                        //{
                        //    title: 'Image count',
                        //    field: 'summary.img-count',
                        //    sortable: true,
                        //    align: 'right',
                        //}, {
                        //    title: 'Paragraph count',
                        //    field: 'summary.p-count',
                        //    sortable: true,
                        //    align: 'right',
                        //}, {
                        //    title: 'Link count',
                        //    field: 'summary.a-count',
                        //    sortable: true,
                        //    align: 'right',
                        //}
                        //, {
                        //    title: 'Relative link count',
                        //    field: 'analyzed-urls.relative-links-count',
                        //    sortable: true,
                        //    align: 'right',
                        //},
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
                        //{
                        //    title: 'Social links',
                        //    field: 'analyzed-urls.social-links',
                        //    sortable: true,
                        //    align: 'right',
                        //    formatter: multilinkFormatter,
                        //}, {
                        //    title: 'Popularity boost links',
                        //    field: 'analyzed-urls.popularity-boosters',
                        //    sortable: true,
                        //    align: 'right',
                        //    formatter: multilinkFormatter,
                        //},
                        //{
                        //    title: 'err',
                        //    field: 'http-error',
                        //    sortable: true,
                        //    align: 'right',
                        //},
                        //{
                        //    title: 'More',
                        //    field: 'http-error',
                        //    sortable: true,
                        //    align: 'right',
                        //},
                        {
                            formatter: moreInfoFormatter,
                        },

                    ]]
            });
        });
    })
    .catch(err => { throw err });
