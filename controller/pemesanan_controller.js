const { request, response } = require("express")
const detailOfPemesananModel = require(`../models/index`).detail_pemesanan
const pemesananModel = require(`../models/index`).pemesanan
const modelUser = require(`../models/index`).user
const kamarModel = require(`../models/index`).kamar
const tipeKamarModel = require(`../models/index`).tipe_kamar

const Op = require(`sequelize`).Op
const Sequelize = require("sequelize");
const sequelize = new Sequelize("hotel_new", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

exports.getAllPemesanan = async (request, response) => {
  try {
    let pemesanans = await pemesananModel.findAll()
    return response.json({
      success: true,
      data: pemesanans,
      message: `semua data sukses ditampilkan sesuai yang anda minta tuan`
    })

  } catch {
    response.send("err")
  }
}

exports.getPemesanan = async (request, response) => {

  // const projects = await sequelize.query(
  //   `SELECT pemesanans.nama_pemesanan , tipe_kamars.nama_tipe_kamar , kamars.nomer_kamar FROM pemesanans JOIN kamars ON pemesanans.tipeKamarId=kamars.tipeKamarId JOIN tipe_kamars ON pemesanans.tipeKamarId=tipe_kamars.id`
  // );

  // let pemesanan = await pemesananModel.findOne({
  //   attributes: [
  //     "nama_pemesanan",
  //     "tipeKamarId",
  //   ],
  // });

  // let kamar = await kamarModel.findOne({
  //   attributes: [
  //     "nomor_kamar",
  //     "tipeKamarId",
  //   ],
  // });

  // let tipeKamar = await tipeKamarModel.findOne({
  //   attributes: [
  //     "id",
  //     "nama_tipe_kamar",
  //   ],
  // });

  let check = await sequelize.query(
    
    `SELECT pemesanans.nama_pemesanan, tipe_kamars.nama_tipe_kamar, kamars.nomor_kamar
    FROM tipe_kamars
    JOIN pemesanans ON pemesanans.tipeKamarId = tipe_kamars.id
    JOIN kamars ON kamars.tipeKamarId = tipe_kamars.id
    GROUP BY pemesanans.nama_pemesanan, tipe_kamars.nama_tipe_kamar, kamars.nomor_kamar;`
  );
  console.log(check);
  try {
    return response.json({
      success: true,
      data: check[0],
      message: `semua data sukses ditampilkan `
      
    })

  } catch {
    response.send("err")
  }
}

// nama pemesanan
// nama tipe kamar
// nomer kamar

exports.findPemesanan = async (request, response) => {
  let status = request.body.status;
  let pemesanans = await pemesananModel.findAll({
    where: {
      [Op.or]: [
        { status: { [Op.substring]: status } },
      ],
    },
  });
  return response.json({
    success: true,
    data: pemesanans,
    message: "All rooms have been loaded",
  });
}

exports.addPemesanan = async (request, response) => {
  let nomor_kamar = request.body.nomor_kamar;
  let kamar = await kamarModel.findOne({
    where: {
      [Op.and]: [{ nomor_kamar: { [Op.substring]: nomor_kamar } }],
    },
    attributes: [
      "id",
      "nomor_kamar",
      "tipeKamarId",
      "createdAt",
      "updatedAt",
    ],
  });

  let nama_user = request.body.nama_user;
  let userId = await modelUser.findOne({
    where: {
      [Op.and]: [{ nama_user: { [Op.substring]: nama_user } }],
    },
  });

  if (kamar === null) {
    return response.json({
      success: false,
      message: `Kamar yang anda inputkan tidak ada`,
    });
  } else if (userId === null) {
    return response.json({
      success: false,
      message: `User yang anda inputkan tidak ada`,
    });
  } else {
    let newPemesanan = {
      nomor_pemesanan: request.body.nomor_pemesanan,
      nama_pemesanan: request.body.nama_pemesan,
      email_pemesanan: request.body.email_pemesan,
      tgl_pemesanan: request.body.tgl_pemesanan,
      tgl_check_in: request.body.tgl_check_in,
      tgl_check_out: request.body.tgl_check_out,
      nama_tamu: request.body.nama_tamu,
      jumlah_kamar: request.body.jumlah_kamar,
      tipeKamarId: kamar.tipeKamarId,
      status_pemesanan: request.body.status_pemesanan,
      userId: userId.id,

    };

    let kamarCheck = await sequelize.query(
      `SELECT * FROM detail_pemesanans WHERE kamarId = ${kamar.id} AND tgl_akses= ${request.body.tgl_check_in}`
    );
    if (kamarCheck[0].length === 0) {
      pemesananModel
        .create(newPemesanan)
        .then((result) => {
          let pemesananID = result.id;
          let detailsOfPemesanan = request.body.details_of_pemesanan;

          for (let i = 0; i < detailsOfPemesanan.length; i++) {
            detailsOfPemesanan[i].pemesananId = pemesananID;
          }

          let newDetail = {
            pemesananId: pemesananID,
            kamarId: kamar.id,
            tgl_akses: result.tgl_check_in,
            harga: detailsOfPemesanan[0].harga,
          };


          detailOfPemesananModel
            .create(newDetail)
            .then((result) => {
              return response.json({
                success: true,
                message: `New transaction has been inserted`,
              });
            })
            .catch((error) => {
              return response.json({
                success: false,
                message: error.message,
              });
            });
        })
        .catch((error) => {
          return response.json({
            success: false,
            message: error.message,
          });
        });
    } else {
      return response.json({
        success: false,
        message: `Kamar yang anda pesan sudah di booking`,
      });
    }
  }
};


exports.updatePemesanan = async (request, response) => {
  let nomor_kamar = request.body.nomor_kamar;
  let kamar = await kamarModel.findOne({
    where: {
      [Op.and]: [{ nomor_kamar: { [Op.substring]: nomor_kamar } }],
    },
    attributes: [
      "id",
      "nomor_kamar",
      "tipeKamarId",
      "createdAt",
      "updatedAt",
    ],
  });

  let nama_user = request.body.nama_user;
  let userId = await modelUser.findOne({
    where: {
      [Op.and]: [{ nama_user: { [Op.substring]: nama_user } }],
    },
  });

  let Pemesanan = {
    nomor_pemesanan: request.body.nomor_pemesanan,
    nama_pemesanan: request.body.nama_pemesan,
    email_pemesanan: request.body.email_pemesan,
    tgl_pemesanan: request.body.tgl_pemesanan,
    tgl_check_in: request.body.tgl_check_in,
    tgl_check_out: request.body.tgl_check_out,
    nama_tamu: request.body.nama_tamu,
    jumlah_kamar: request.body.jumlah_kamar,
    tipeKamarId: kamar.tipeKamarId,
    status_pemesanan: request.body.status_pemesanan,
    userId: userId.id,
  };

  let pemesananId = request.params.id;

  pemesananModel.update(Pemesanan, { where: { id: pemesananId } })
    .then(async (result) => {
      await detailOfPemesananModel.destroy({
        where: { id: pemesananId },
      });

      let detailsOfPemesanan = request.body.details_of_pemesanan;

      for (let i = 0; i < detailsOfPemesanan.length; i++) {
        detailsOfPemesanan[i].pemesananId = pemesananId;
      }

      let newDetail = {
        pemesananId: pemesananId,
        kamarId: kamar.id,
        tgl_akses: result.tgl_check_in,
        harga: detailsOfPemesanan[0].harga,
      };

      detailOfPemesananModel
        .create(newDetail)
        .then((result) => {
          return response.json({
            success: true,
            message: `terupdate mbah`,
          });
        })
        .catch((error) => {
          return response.json({
            success: false,
            message: error.message,
          });
        });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
}


exports.deletePemesanan = async (request, response) => {
  let pemesananId = request.params.id
  detailOfPemesananModel
  .destroy({
    where: {id:pemesananId},
  })
  .then((result) => {
    pemesananModel.destroy({where: {id:pemesananId}})
    .then((result)=> {
      return response.json({
        success: true,
        message: 'terhapus semua kenangan'
      });
    })
  .catch((error)=>{
    return response.json({
      success:false,
      message:error.message,
    });
  });   
})
.catch((error) => {
return response.json({
  success: false,
  message: error.message,
});
});
};