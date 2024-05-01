//in controller api

@CrossOrigin(origins = "*")
    @PostMapping("/create")
    public ResponseEntity<?> create(
            @RequestParam("email") String email,
            @RequestParam("dateNai") String dateNai,
            @RequestParam("avatar") MultipartFile avatar,
            @RequestParam("name") String name,
            @RequestParam("password") String password
    ) throws IOException {
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

            Date d = dateFormat.parse(dateNai);
        creatorService.AddCreator(name,email,d,avatar,password);
    } catch (IOException e) {
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    } catch (ParseException e) {
            throw new RuntimeException(e);
        }
        return new ResponseEntity("Successfully added !", HttpStatus.OK);
    }


    // in service 


        String HOSTNAME = "http://localhost:8089/content/";
        String LOCAL = "src/main/resources/static/public/";
   

    @Override
    public Creator AddCreator(String name, String email, Date dateNai, MultipartFile avatar, String password) throws IOException {
        Creator cr = Crepo.findByEmail(email);

        if (cr !=null){

            throw new RuntimeException("Already Exist");
        }

        String avatarPATH = Host.LOCAL + avatar.getOriginalFilename(); // saved path locally
        Files.write(Paths.get(avatarPATH),avatar.getBytes());

        Creator creator = new Creator(null,name,email,dateNai,avatarPATH.replace(Host.LOCAL,Host.HOSTNAME), Role.USER,password,new Date(),null);
        return Crepo.save(creator);
    }


    // Angular - service


  public addCreator(creator: Creator, avatar: File): Observable<Creator> {
    const formData: FormData = new FormData();
    formData.append('avatar', avatar);
    formData.append('name', creator.name);
    formData.append('email', creator.email);
    formData.append('dateNai', creator.dateNai.toString()); // Convert dateNai to string
    formData.append('password', creator.password);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return this.http.post<Creator>(this.BaseUrl + "create", formData, { headers: headers });
  }



  // in html addComponent
  <input type="file" 
            formControlName="avatar"
            (change)="handleFileSelected($event)" 
            class="" />
// in ts addcomponent
  avatar!:File;
  handleFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.avatar=file

  }
  handleAddCreator(){
    let creator:Creator = this.formAddCreator.value;
     this.cs.addCreator(creator,this.avatar).subscribe(
      {
        next: data=>{
          if(data instanceof HttpErrorResponse && data.status === 200){
                      alert("data stocked success !");

          } else {
            alert("data stocked success !");
            this.formAddCreator.reset();
        }
      },
        error:err=>console.log(err)
      }
     );
  }

